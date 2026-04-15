using backend.Data;
using backend.Modules.CoursesBase.DTOs;
using backend.Modules.CoursesBase.Models;
using backend.Modules.Engagement.DTOs;
using backend.Modules.Engagement.Models;
using backend.Modules.Shared.DTOs;
using backend.Modules.Shared.Results;
using backend.Modules.Shared.Services;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

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

            var course = new CourseBaseModel
            {
                TeacherId = teacherId,
                CourseName = newCourse.CourseName,
                Description = newCourse.Description,
                Type = newCourse.Type,
                CourseDomainId = newCourse.CourseDomainId,
                CourseLevelId = newCourse.CourseLevelId,
                Price = newCourse.Price,
                FirstConsultationFree = newCourse.FirstConsultationFree,
                PriceCurrencyId = newCourse.PriceCurrencyId,
                Status = newCourse.Status ?? CourseStatus.Active,
                IconImageId = newCourse.IconImageId,
                BannerImageId = newCourse.BannerImageId,
                TokenMinuteValue = newCourse.LessonLenght
            };

            _db.CourseBases.Add(course);
            await _db.SaveChangesAsync(ct);

            if (newCourse.Locations.Contains("Online"))
            {
                _db.CoursesToPlaces.Add(new CourseToPlace { Online = true, CourseId = course.Id, PlaceId = null  });
                newCourse.Locations.Remove("Online");
            }

            var tags = await _courseMetadataService.CreateOrGetTagsAsync(newCourse.Tags, ct);
            var languageIds = await _lookupService.GetLanguagesFromList(newCourse.Languages, ct);
            var locationIds = await _lookupService.GetCititesFromList(newCourse.Locations, ct);

            var tagConnections = MapToCourseTags(course.Id, tags.Data);
            var languageConnections = MapToCourseLanguages(course.Id, languageIds.Data);
            var cityConnections = MapToPlaces(course.Id, locationIds.Data);

            _db.CoursesToTags.AddRange(tagConnections);
            _db.CoursesToLanguages.AddRange(languageConnections);
            _db.CoursesToPlaces.AddRange(cityConnections);

            newCourse.Id = course.Id;

            await _db.SaveChangesAsync(ct);
            return ServiceResult<CourseBaseCreationDTO>.Success(newCourse);
        }

        public async Task<ServiceResult<List<CourseBaseExplorerDTO>>> GetAllCourses(CancellationToken ct)
        {
            var courses = await _db.CourseBases.Select(ToExploreDto).AsNoTracking().ToListAsync(ct);

            return ServiceResult<List<CourseBaseExplorerDTO>>.Success(courses);
        }

        public async Task<ServiceResult<List<CourseBaseExplorerDTO>>> GetTeacherCourses(string TeacherId, CancellationToken ct)
        {
            var courses = _db.CourseBases.Where(x => x.TeacherId == TeacherId).Select(ToExploreDto).ToList();

            return ServiceResult<List<CourseBaseExplorerDTO>>.Success(courses);
        }

        public async Task<ServiceResult<string>> GetCourseTeacherIdAsync(Guid courseId, CancellationToken ct = default)
        {
            var teacherId = await _db.CourseBases.Where(x => x.Id == courseId).Select(x => x.TeacherId).AsNoTracking().FirstOrDefaultAsync(ct);
            if (teacherId is null)
            {
                return ServiceResult<string>.NotFound("No course found");
            }
            return ServiceResult<string>.Success(teacherId);
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

            if (filtersDTO.Locations is { Count: > 0})
            {
                bool includeOnline = filtersDTO.Locations.Contains("Online");
                var cities = filtersDTO.Locations.Where(x => x != "Online").ToList();
                query = query.Where(x => x.CourseToPlaces.Any(x => (includeOnline && x.Online) || (cities.Contains(x.City.CityName))));
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
                .Select(ToExploreDto)
                .ToListAsync(ct);

            var coursesResponse = new CourseBaseListResultDTO
            {
                Courses = courses,
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
                .Select(ToOneCourseDto)
                .AsNoTracking()
                .FirstOrDefaultAsync(ct);

            if (course == null)
            {
                return ServiceResult<CourseBaseDTO>.Failure("No such course found");
            }

            return ServiceResult<CourseBaseDTO>.Success(course);
        }

        public async Task<ServiceResult> UpdateCourseBaseAsync(CourseBaseCreationDTO dto, CancellationToken ct)
        {
            if (dto.Id is null)
            {
                return ServiceResult.NotFound("No course was found");
            }

            var course = await _db.CourseBases.Where(x => x.Id == dto.Id).FirstOrDefaultAsync(ct);

            if (course is null)
            {
                return ServiceResult.NotFound("No course was found");
            }

            course = MapFromDto(course, dto);

            _db.CourseBases.Update(course);

            try
            {
                await _db.SaveChangesAsync(ct);
                return ServiceResult.Success();
            }
            catch (Exception)
            {
                return ServiceResult.Failure("Update failed");
            }


        }

        public Task<ServiceResult> DeleteCourseBaseAsync(CancellationToken ct)
        {
            throw new NotImplementedException();
        }

        public CourseBaseModel MapFromDto(CourseBaseModel model, CourseBaseCreationDTO dto)
        {
            model.CourseName = dto.CourseName;
            model.Description = dto.Description;
            model.Type = dto.Type;
            model.CourseDomainId = dto.CourseDomainId;
            model.CourseLevelId = dto.CourseLevelId;
            model.TokenMinuteValue = dto.LessonLenght; 
            model.Price = dto.Price;
            model.FirstConsultationFree = dto.FirstConsultationFree;
            model.PriceCurrencyId = dto.PriceCurrencyId;

            if (dto.Status.HasValue)
                model.Status = dto.Status.Value;

            if (dto.IconImageId.HasValue)
                model.IconImageId = dto.IconImageId;

            if (dto.BannerImageId.HasValue)
                model.BannerImageId = dto.BannerImageId;

            return model;
        }

        public static Expression<Func<CourseBaseModel, CourseBaseExplorerDTO>> ToExploreDto =>
            model => new CourseBaseExplorerDTO
            {
                Id = model.Id,
                TeacherId = model.TeacherId,
                TeacherImage = model.Teacher.User.ProfilePicture.StoragePath ?? null,
                TeacherName = model.Teacher.User.FullName,
                TeacherLocation = model.Teacher.User.City,
                CourseName = model.CourseName,
                Type = model.Type,
                CourseDomain = new LookUpDTO { Name = model.CourseDomain.Name, Id = model.CourseDomainId },
                CourseLevel = new LookUpDTO { Name = model.CourseLevel.Name, Id = model.CourseLevelId },
                Price = model.Price,
                FirstConsultationFree = model.FirstConsultationFree,
                Currency = new CurrencyDTO() { Id = model.PriceCurrencyId, CurrencyCode = model.Currency.CurrencyCode, CurrencySymbol = model.Currency.CurrencySymbol, Name = model.Currency.Name },
                IconImage = model.Teacher.User.ProfilePicture.StoragePath ?? null,
                BannerImage = model.BannerImage.StoragePath ?? null,
                Tags = model.CourseToTags.Select(x => new LookUpDTO { Id = x.TagId, Name = x.Tag.Name }).ToList(),
                Languages = model.CourseToLanguages.Select(x => new LookUpDTO { Id = x.LanguageId, Name = x.Language.Name }).ToList(),
                RatingAverage = model.Reviews.Average(x => (float?)x.ReviewScore) ?? 0f,
                Locations = model.CourseToPlaces.Select(x => new LookUpDTO { Id = x.PlaceId, Name = x.City.CityName ?? "Online" }).ToList()
                
            };

        public static Expression<Func<CourseBaseModel, CourseBaseDTO>> ToOneCourseDto => model =>
             new CourseBaseDTO
            {
                Id = model.Id,
                TeacherId = model.TeacherId,
                TeacherImage = model.Teacher.User.ProfilePicture.StoragePath ?? null,
                TeacherName = model.Teacher.User.FullName,
                Locations = model.CourseToPlaces.Select(x => new LookUpDTO { Id = x.PlaceId, Name = x.City.CityName ?? "Online" }).ToList(),
                CourseName = model.CourseName,
                Type = model.Type,
                Description = model.Description,
                Reviews = model.Reviews.OrderByDescending(x => x.CreatedAt).Select(x => new CourseReviewDTO { Text = x.Text, CourseId = x.CourseId, Id = x.Id, Recommended = x.Recommended, ReviewerImage = x.Reviewer.User.ProfilePicture.StoragePath ?? null, ReviewerName = x.Reviewer.User.FullName, ReviewScore = x.ReviewScore }).ToList(),
                CourseDomain = new LookUpDTO { Name = model.CourseDomain.Name, Id = model.CourseDomainId },
                CourseLevel = new LookUpDTO { Name = model.CourseLevel.Name, Id = model.CourseLevelId },
                Price = model.Price,
                FirstConsultationFree = model.FirstConsultationFree,
                Currency = new CurrencyDTO() { Id = model.PriceCurrencyId, CurrencyCode = model.Currency.CurrencyCode, CurrencySymbol = model.Currency.CurrencySymbol, Name = model.Currency.Name },
                 IconImage = model.Teacher.User.ProfilePicture.StoragePath ?? null,
                 BannerImage = model.BannerImage.StoragePath ?? null,
                 Tags = model.CourseToTags.OrderBy(x => x.Tag.Name).Select(x => new LookUpDTO { Id = x.TagId, Name = x.Tag.Name }).ToList(),
                Languages = model.CourseToLanguages.OrderBy(x => x.Language.Name).Select(x => new LookUpDTO { Id = x.LanguageId, Name = x.Language.Name }).ToList(),
                RatingAverage = model.Reviews.Average(x => (float?)x.ReviewScore) ?? 0f,
                TeacherIntroduction = model.Teacher.User.Introduction ?? "",
                ClassLenght = model.TokenMinuteValue
            };

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

        public static IEnumerable<CourseToPlace> MapToPlaces(Guid courseId, List<Guid> placeIds)
        {
            return placeIds.Select(placeId => new CourseToPlace
            {
                PlaceId = placeId, CourseId = courseId, Online = false
            });
        }

        public static Expression<Func<CourseReview, CourseReviewDTO>> CourseReviewToDto => model =>
             new CourseReviewDTO
            {
                Id = model.Id,
                CourseId = model.CourseId,
                ReviewerName = model.Reviewer.User.FullName ?? "Anonymous",
                ReviewerImage = model.Reviewer.User.ProfilePicture.StoragePath ?? null,
                Recommended = model.Recommended,
                Text = model.Text,
                ReviewScore = model.ReviewScore
            };
    }
}
