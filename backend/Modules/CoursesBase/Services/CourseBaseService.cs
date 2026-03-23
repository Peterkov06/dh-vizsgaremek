using backend.Data;
using backend.Modules.CoursesBase.DTOs;
using backend.Modules.CoursesBase.Models;
using backend.Modules.Engagement.DTOs;
using backend.Modules.Engagement.Models;
using backend.Modules.Identity.Models;
using backend.Modules.Shared.DTOs;
using backend.Modules.Shared.Results;
using Microsoft.EntityFrameworkCore;

namespace backend.Modules.CoursesBase.Services
{
    public class CourseBaseService : ICourseBaseService
    {
        private readonly AppDbContext _db;
        private readonly ICourseMetadataService _courseMetadataService;

        public CourseBaseService(AppDbContext db, ICourseMetadataService courseMetadataService)
        {
            _db = db;
            _courseMetadataService = courseMetadataService;
        }

        public async Task<ServiceResult<CourseBaseCreationDTO>> CreateCourseBaseAsync(CourseBaseCreationDTO newCourse, CancellationToken ct)
        {
            var exists = await _db.CourseBases.Where(x => x.TeacherId == newCourse.TeacherId).AnyAsync(x => x.CourseName == newCourse.CourseName, ct);

            if (exists)
            {
                return ServiceResult<CourseBaseCreationDTO>.Failure("Course with such name exists");
            }

            var course = ToEntity(newCourse);
            _db.CourseBases.Add(course);
            await _db.SaveChangesAsync(ct);

            var tags = MapToCourseTags(course.Id, newCourse.TagIds);
            var languages = MapToCourseLanguages(course.Id, newCourse.LanguageIds);

            _db.CoursesToTags.AddRange(tags);
            _db.CoursesToLanguages.AddRange(languages);

            newCourse.Id = course.Id;

            await _db.SaveChangesAsync(ct);
            return ServiceResult<CourseBaseCreationDTO>.Success(newCourse);
        }

        public async Task<ServiceResult<List<CourseBaseDTO>>> GetAllCourses(CancellationToken ct)
        {
            var courses = _db.CourseBases.Include(x => x.CourseToTags).ThenInclude(x => x.Tag).Include(x => x.Teacher).Include(x => x.Currency).Include(x => x.CourseToLanguages).ThenInclude(x => x.Language).Include(x => x.Teacher).ThenInclude(x => x.User).Include(x => x.Reviews).ThenInclude(x => x.Reviewer).ThenInclude(x => x.User).ThenInclude(x => x.ProfilePicture).Select(ToDto).ToList();

            return ServiceResult<List<CourseBaseDTO>>.Success(courses);
        }

        public async Task<ServiceResult<List<CourseBaseDTO>>> GetTeacherCourses(string TeacherId, CancellationToken ct)
        {
            var courses = _db.CourseBases.Where(x => x.TeacherId == TeacherId).Include(x => x.CourseToTags).ThenInclude(x => x.Tag).Include(x => x.Teacher).Include(x => x.Currency).Include(x => x.CourseToLanguages).ThenInclude(x => x.Language).Include(x => x.Teacher).ThenInclude(x => x.User).Include(x => x.Reviews).ThenInclude(x => x.Reviewer).ThenInclude(x => x.User).ThenInclude(x => x.ProfilePicture).Select(ToDto).ToList();

            return ServiceResult<List<CourseBaseDTO>>.Success(courses);
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
                OrderByType.Review => query.OrderByDescending(x => x.Reviews.Select(x => x.ReviewScore).Sum() / x.Reviews.Count),
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
                Courses = courses.Select(ToDto).ToList(),
                CoursesPerPage = filtersDTO.CoursesPerPage,
                PageNum = filtersDTO.PageNum,
                TotalCourses = totalCount,
                TotalPages = Convert.ToInt32(Math.Ceiling((double)totalCount / filtersDTO.CoursesPerPage))
            };

            return ServiceResult<CourseBaseListResultDTO>.Success(coursesResponse);
        }

        public Task<ServiceResult<CourseBaseCreationDTO>> UpdateCourseBaseAsync(CancellationToken ct)
        {
            throw new NotImplementedException();
        }

        public Task<ServiceResult> DeleteCourseBaseAsync(CancellationToken ct)
        {
            throw new NotImplementedException();
        }

        public CourseBaseModel ToEntity(CourseBaseCreationDTO dto)
        {
            return new CourseBaseModel
            {
                TeacherId = dto.TeacherId,
                CourseName = dto.CourseName,
                Description = dto.Description,
                Type = dto.Type,
                CourseDomainId = dto.CourseDomainId,
                CourseLevelId = dto.CourseLevelId,
                Price = dto.Price,
                FirstConsultationFree = dto.FirstConsultationFree,
                PriceCurrencyId = dto.PriceCurrencyId,
                Status = dto.Status,
                IconImageId = dto.IconImageId,
                BannerImageId = dto.BannerImageId
            };
        }

        public CourseBaseDTO ToDto(CourseBaseModel model)
        {
            return new CourseBaseDTO
            {
                Id = model.Id,
                TeacherId = model.TeacherId,
                TeacherImage = "",
                TeacherName = model.Teacher.User.FullName,
                TeacherLocation = model.Teacher.User.City,
                CourseName = model.CourseName,
                Description = model.Description,
                Type = model.Type,
                CourseDomainId = model.CourseDomainId,
                CourseLevelId = model.CourseLevelId,
                Price = model.Price,
                FirstConsultationFree = model.FirstConsultationFree,
                Currency = new CurrencyDTO() { Id = model.PriceCurrencyId, CurrencyCode = model.Currency.CurrencyCode, CurrencySymbol = model.Currency.CurrencySymbol, Name = model.Currency.Name },
                Status = model.Status,
                IconImageId = model.IconImageId,
                BannerImageId = model.BannerImageId,
                Tags = [.. model.CourseToTags.Select(x => new LookUpDTO { Id = x.TagId, Name = x.Tag.Name })],
                Languages = [.. model.CourseToLanguages.Select(x => new LookUpDTO { Id = x.LanguageId, Name = x.Language.Name })],
                Reviews = [.. model.Reviews.Select(CourseReviewToDto)]
            };
        }

        public IEnumerable<CourseToTag> MapToCourseTags(Guid courseId, List<Guid> tagIds)
        {
            return tagIds.Select(tagId => new CourseToTag
            {
                CourseId = courseId,
                TagId = tagId
            });
        }

        public IEnumerable<CourseToLanguage> MapToCourseLanguages(Guid courseId, List<Guid> languageIds)
        {
            return languageIds.Select(langId => new CourseToLanguage
            {
                CourseId = courseId,
                LanguageId = langId
            });
        }

        public CourseReviewDTO CourseReviewToDto(CourseReview model)
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
