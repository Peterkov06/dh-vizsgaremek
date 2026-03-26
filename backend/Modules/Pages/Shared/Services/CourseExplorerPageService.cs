using backend.Modules.CoursesBase.Services;
using backend.Modules.Pages.Shared.DTOs;
using backend.Modules.Shared.Results;
using backend.Modules.Shared.Services;

namespace backend.Modules.Pages.Shared.Services
{
    public class CourseExplorerPageService : ICourseExplorerPageService
    {
        private readonly ICourseBaseService _courseBaseService;
        private readonly ILookUpService _lookUpService;
        private readonly ICourseMetadataService _courseMetadataService;

        public CourseExplorerPageService(ICourseBaseService courseBaseService, ILookUpService lookUpService, ICourseMetadataService courseMetadataService)
        {
            _courseBaseService = courseBaseService;
            _lookUpService = lookUpService;
            _courseMetadataService = courseMetadataService;
        }

        public async Task<ServiceResult<CourseExplorerPageDTO>> GetExplorerPage(CancellationToken ct)
        {
            var languages = await _lookUpService.GetLanguagesAsync(ct);
            var domains = await _courseMetadataService.GetAllDomainsAsync(ct);
            var levels = await _courseMetadataService.GetAllLevelsAsync(ct);
            var tags = await _courseMetadataService.GetAllTagsAsync(ct: ct);
            var courses = await _courseBaseService.GetCoursesPage(new(),ct);
            var minPrice = Convert.ToInt32(Math.Floor(courses.Data.Courses.Min(x => x.Price)));
            var maxPrice = Convert.ToInt32(Math.Ceiling(courses.Data.Courses.Max(x => x.Price)));

            return ServiceResult<CourseExplorerPageDTO>.Success(new CourseExplorerPageDTO
            {
                Courses = courses.Data,
                Domains = domains.Data,
                Languages = languages.Data,
                Levels = levels.Data,
                MaxPrice = maxPrice,
                MinPrice = minPrice,
                Tags = tags.Data
            });
        }
    }
}
