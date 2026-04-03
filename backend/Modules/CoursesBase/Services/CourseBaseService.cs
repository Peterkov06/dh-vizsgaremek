using backend.Data;
using backend.Modules.CoursesBase.DTOs;
using backend.Modules.CoursesBase.Models;
using backend.Modules.Engagement.DTOs;
using backend.Modules.Engagement.Models;
using backend.Modules.Shared.DTOs;
using backend.Modules.Shared.Results;
using backend.Modules.Shared.Services;
using Microsoft.EntityFrameworkCore;

namespace backend.Modules.CoursesBase.Services
{
    public class CourseBaseService : ICourseBaseService
    {
        private readonly AppDbContext _db;
        private readonly ICourseMetadataService _courseMetadataService;
        private readonly ILookUpService _lookupService;

        public CourseBaseService(AppDbContext db, ICourseMetadataService courseMetadataService, ILookUpService lookupService)
        {
            _db = db;
            _courseMetadataService = courseMetadataService;
            _lookupService = lookupService;
        }

        public async Task<ServiceResult<CourseBaseCreationDTO>> CreateCourseBaseAsync(CourseBaseCreationDTO newCourse, string teacherId, CancellationToken ct)
        {
            var exists = await _db.CourseBases.Where(x => x.TeacherId == teacherId).AnyAsync(x => x.CourseName == newCourse.CourseName, ct);

            if (exists)
            {
                return ServiceResult<CourseBaseCreationDTO>.Failure("Course with such name exists");
            }

            var course = ToEntity(newCourse, teacherId);
            _db.CourseBases.Add(course);
            await _db.SaveChangesAsync(ct);

            var tags = await _courseMetadataService.CreateOrGetTagsAsync(newCourse.Tags, ct);
            var languageIds = await _lookupService.GetLanguagesFromList(newCourse.Languages, ct);

            var tagConnections = MapToCourseTags(course.Id, tags.Data);
            var languageConnections = MapToCourseLanguages(course.Id, languageIds.Data);

            _db.CoursesToTags.AddRange(tagConnections);
            _db.CoursesToLanguages.AddRange(languageConnections);

            newCourse.Id = course.Id;

            await _db.SaveChangesAsync(ct);
            return ServiceResult<CourseBaseCreationDTO>.Success(newCourse);
        }

        public async Task<ServiceResult<List<CourseBaseExplorerDTO>>> GetAllCourses(CancellationToken ct)
        {
            var courses = _db.CourseBases.Include(x => x.CourseToTags).ThenInclude(x => x.Tag).Include(x => x.Teacher).Include(x => x.Currency).Include(x => x.CourseToLanguages).ThenInclude(x => x.Language).Include(x => x.Teacher).ThenInclude(x => x.User).Include(x => x.Reviews).ThenInclude(x => x.Reviewer).ThenInclude(x => x.User).ThenInclude(x => x.ProfilePicture).Select(ToExploreDto).ToList();

            return ServiceResult<List<CourseBaseExplorerDTO>>.Success(courses);
        }

        public async Task<ServiceResult<List<CourseBaseExplorerDTO>>> GetTeacherCourses(string TeacherId, CancellationToken ct)
        {
            var courses = _db.CourseBases.Where(x => x.TeacherId == TeacherId).Include(x => x.CourseToTags).ThenInclude(x => x.Tag).Include(x => x.Teacher).Include(x => x.Currency).Include(x => x.CourseToLanguages).ThenInclude(x => x.Language).Include(x => x.Teacher).ThenInclude(x => x.User).Include(x => x.Reviews).ThenInclude(x => x.Reviewer).ThenInclude(x => x.User).ThenInclude(x => x.ProfilePicture).Select(ToExploreDto).ToList();

            return ServiceResult<List<CourseBaseExplorerDTO>>.Success(courses);
        }

        public async Task<ServiceResult<string>> GetCourseTeacherNameAsync(Guid courseId, CancellationToken ct = default)
        {
            var teacherName = await _db.CourseBases.Where(x => x.Id == courseId).Include(x => x.Teacher).ThenInclude(x => x.User).Select(x => x.Teacher.User.FullName).FirstOrDefaultAsync(ct);
            if (teacherName is null)
            {
                return ServiceResult<string>.NotFound("No course found");
            }
            return ServiceResult<string>.Success(teacherName);
        }

        public async Task<ServiceResult<CourseBaseListResultDTO>> GetCoursesPage(CourseFiltersDTO filtersDTO, CancellationToken ct)
        {
            var query = _db.CourseBases.AsQueryable();

            if (!string.IsNullOrWhiteSpace(filtersDTO.Keyword))
            {
                var keyword = filtersDTO.Keyword.ToLower();
                query = query.Where(x => x.CourseName.ToLower().Contains(keyword));
            }

            if (filtersDTO.Domains is { Count: > 0 }) 
            {
                query = query.Where(x => filtersDTO.Domains.Contains(x.CourseDomain.Name));
            }

            if (filtersDTO.Levels is { Count: > 0 }) 
            {
                query = query.Where(x => filtersDTO.Levels.Contains(x.CourseLevel.Name));
            }   

            if (filtersDTO.Tags is { Count: > 0 }) 
            {
                query = query.Where(x => x.CourseToTags.Any(x => filtersDTO.Tags.Contains(x.Tag.Name)));
            }

            if (filtersDTO.Languages is { Count: > 0 }) 
            {
                query = query.Where(x => x.CourseToLanguages.Any(x => filtersDTO.Languages.Contains(x.Language.Name)));
            }

            if (filtersDTO.MinPrice.HasValue)
            {
                query = query.Where(x => x.Price >= filtersDTO.MinPrice);
            }

            if (filtersDTO.MaxPrice.HasValue)
            {
                query = query.Where(x => x.Price <= filtersDTO.MaxPrice);
            }

            if (!string.IsNullOrWhiteSpace(filtersDTO.TeacherId))
            {
                query = query.Where(x => x.TeacherId == filtersDTO.TeacherId);
            }

            query = filtersDTO.OrderBy switch
            {
                OrderByType.Popularity => query.OrderByDescending(x => x.Id),
                OrderByType.Review => query.OrderByDescending(x => x.Reviews.Average(x => (double?)x.ReviewScore) ?? 0),
                OrderByType.Recent => query.OrderByDescending(x => x.CreatedAt),
                OrderByType.PriceAscending => query.OrderBy(x => x.Price),
                OrderByType.PriceDescending => query.OrderByDescending(x => x.Price),
                _ => query.OrderBy(x => x.Id),
            };

            var totalCount = await query.CountAsync(ct);

            var courses = await query
                .Skip((filtersDTO.PageNum - 1) * filtersDTO.CoursesPerPage)
                .Take(filtersDTO.CoursesPerPage)
                .Include(x => x.CourseToTags).ThenInclude(x => x.Tag)
                .Include(x => x.CourseToLanguages).ThenInclude(x => x.Language)
                .Include(x => x.Teacher).ThenInclude(x => x.User)
                    .ThenInclude(x => x.ProfilePicture)
                .Include(x => x.Currency)
                .Include(x => x.CourseLevel)
                .Include(x => x.CourseDomain)
                .Include(x => x.Reviews)
                .ToListAsync(ct);

            var coursesResponse = new CourseBaseListResultDTO
            {
                Courses = courses.Select(ToExploreDto).ToList(),
                CoursesPerPage = filtersDTO.CoursesPerPage,
                PageNum = filtersDTO.PageNum,
                TotalCourses = totalCount,
                TotalPages = Convert.ToInt32(Math.Ceiling((double)totalCount / filtersDTO.CoursesPerPage))
            };

            return ServiceResult<CourseBaseListResultDTO>.Success(coursesResponse);
        }

        public async Task<ServiceResult<CourseBaseDTO>> GetOneCourse(Guid id, CancellationToken ct)
        {
            var course = await _db.CourseBases.Where(x => x.Id == id)
                .Include(x => x.CourseToTags).ThenInclude(x => x.Tag)
                .Include(x => x.CourseToLanguages).ThenInclude(x => x.Language)
                .Include(x => x.Teacher).ThenInclude(x => x.User)
                    .ThenInclude(x => x.ProfilePicture)
                .Include(x => x.Currency)
                .Include(x => x.CourseLevel)
                .Include(x => x.CourseDomain)
                .Include(x => x.Reviews).ThenInclude(x => x.Reviewer).ThenInclude(x => x.User).ThenInclude(x => x.ProfilePicture)
                .FirstOrDefaultAsync(ct);

            if (course == null)
            {
                return ServiceResult<CourseBaseDTO>.Failure("No such course found");
            }

            return ServiceResult<CourseBaseDTO>.Success(ToOneCourseDto(course));
        }

        public Task<ServiceResult<CourseBaseCreationDTO>> UpdateCourseBaseAsync(CancellationToken ct)
        {
            throw new NotImplementedException();
        }

        public Task<ServiceResult> DeleteCourseBaseAsync(CancellationToken ct)
        {
            throw new NotImplementedException();
        }

        public static CourseBaseModel ToEntity(CourseBaseCreationDTO dto, string teacherId)
        {
            return new CourseBaseModel
            {
                TeacherId = teacherId,
                CourseName = dto.CourseName,
                Description = dto.Description,
                Type = dto.Type,
                CourseDomainId = dto.CourseDomainId,
                CourseLevelId = dto.CourseLevelId,
                Price = dto.Price,
                FirstConsultationFree = dto.FirstConsultationFree,
                PriceCurrencyId = dto.PriceCurrencyId,
                Status = dto.Status ?? CourseStatus.Active,
                IconImageId = dto.IconImageId,
                BannerImageId = dto.BannerImageId
            };
        }

        public static CourseBaseExplorerDTO ToExploreDto(CourseBaseModel model)
        {
            return new CourseBaseExplorerDTO
            {
                Id = model.Id,
                TeacherId = model.TeacherId,
                TeacherImage = "",
                TeacherName = model.Teacher.User.FullName,
                TeacherLocation = model.Teacher.User.City,
                CourseName = model.CourseName,
                Type = model.Type,
                CourseDomain = new LookUpDTO { Name = model.CourseDomain.Name, Id = model.CourseDomainId },
                CourseLevel = new LookUpDTO { Name = model.CourseLevel.Name, Id = model.CourseLevelId },
                Price = model.Price,
                FirstConsultationFree = model.FirstConsultationFree,
                Currency = new CurrencyDTO() { Id = model.PriceCurrencyId, CurrencyCode = model.Currency.CurrencyCode, CurrencySymbol = model.Currency.CurrencySymbol, Name = model.Currency.Name },
                IconImage = "",
                BannerImage = "",
                Tags = [.. model.CourseToTags.Select(x => new LookUpDTO { Id = x.TagId, Name = x.Tag.Name })],
                Languages = [.. model.CourseToLanguages.Select(x => new LookUpDTO { Id = x.LanguageId, Name = x.Language.Name })],
                RatingAverage = model.Reviews.Average(x => (float?)x.ReviewScore) ?? 0f,
            };
        }

        public static CourseBaseDTO ToOneCourseDto(CourseBaseModel model)
        {
            return new CourseBaseDTO
            {
                Id = model.Id,
                TeacherId = model.TeacherId,
                TeacherImage = "",
                TeacherName = model.Teacher.User.FullName,
                TeacherLocation = model.Teacher.User.City,
                CourseName = model.CourseName,
                Type = model.Type,
                Description = model.Description,
                Reviews = model.Reviews.Select(x => new CourseReviewDTO { Text = x.Text, CourseId = x.CourseId, Id = x.Id, Recommended = x.Recommended, ReviewerImage = "", ReviewerName = x.Reviewer.User.FullName, ReviewScore = x.ReviewScore }).ToList(),
                CourseDomain = new LookUpDTO { Name = model.CourseDomain.Name, Id = model.CourseDomainId },
                CourseLevel = new LookUpDTO { Name = model.CourseLevel.Name, Id = model.CourseLevelId },
                Price = model.Price,
                FirstConsultationFree = model.FirstConsultationFree,
                Currency = new CurrencyDTO() { Id = model.PriceCurrencyId, CurrencyCode = model.Currency.CurrencyCode, CurrencySymbol = model.Currency.CurrencySymbol, Name = model.Currency.Name },
                IconImage = "",
                BannerImage = "",
                Tags = [.. model.CourseToTags.Select(x => new LookUpDTO { Id = x.TagId, Name = x.Tag.Name })],
                Languages = [.. model.CourseToLanguages.Select(x => new LookUpDTO { Id = x.LanguageId, Name = x.Language.Name })],
                RatingAverage = model.Reviews.Average(x => (float?)x.ReviewScore) ?? 0f,
                TeacherIntroduction = model.Teacher.User.Introduction ?? ""
            };
        }

        public static IEnumerable<CourseToTag> MapToCourseTags(Guid courseId, List<Guid> tagIds)
        {
            return tagIds.Select(tagId => new CourseToTag
            {
                CourseId = courseId,
                TagId = tagId
            });
        }

        public static IEnumerable<CourseToLanguage> MapToCourseLanguages(Guid courseId, List<Guid> languageIds)
        {
            return languageIds.Select(langId => new CourseToLanguage
            {
                CourseId = courseId,
                LanguageId = langId
            });
        }

        public static CourseReviewDTO CourseReviewToDto(CourseReview model)
        {
            return new CourseReviewDTO
            {
                Id = model.Id,
                CourseId = model.CourseId,
                ReviewerName = model.Reviewer?.User?.FullName ?? "Anonymous",
                ReviewerImage = model.Reviewer?.User?.ProfilePicture?.StoragePath ?? string.Empty,
                Recommended = model.Recommended,
                Text = model.Text,
                ReviewScore = model.ReviewScore
            };
        }
    }
}
