using backend.Data;
using backend.Modules.CoursesBase.DTOs;
using backend.Modules.CoursesBase.Models;
using backend.Modules.Engagement.DTOs;
using backend.Modules.Engagement.Models;
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

            await _db.SaveChangesAsync(ct);
            return ServiceResult<CourseBaseCreationDTO>.Success(newCourse);
        }

        public async Task<ServiceResult<List<CourseBaseDTO>>> GetAllCourses(CancellationToken ct)
        {
            var courses = _db.CourseBases.Include(x => x.CourseToTags).ThenInclude(x => x.Tag).Include(x => x.Teacher).Include(x => x.Currency).Include(x => x.CourseToLanguages).ThenInclude(x => x.Language).Include(x => x.Teacher).ThenInclude(x => x.User).Include(x => x.Reviews).ThenInclude(x => x.Reviewer).ThenInclude(x => x.User).ThenInclude(x => x.ProfilePicture).Select(ToDto).ToList();

            return ServiceResult<List<CourseBaseDTO>>.Success(courses);
        }

        public Task<ServiceResult<List<CourseBaseDTO>>> GetTeacherCourses(CancellationToken ct)
        {
            throw new NotImplementedException();
        }

        public Task<ServiceResult<List<CourseBaseDTO>>> GetCoursesPage(int perPage, int pageNum, CancellationToken ct)
        {
            throw new NotImplementedException();
        }

        public Task<ServiceResult<List<CourseBaseDTO>>> GetTeacherCoursesPage(int perPage, int pageNum, CancellationToken ct)
        {
            throw new NotImplementedException();
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
