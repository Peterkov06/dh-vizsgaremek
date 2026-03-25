using backend.Models;
using backend.Modules.CoursesBase.Services;
using backend.Modules.Pages.Teacher.DTOs;
using backend.Modules.Shared.Results;
using backend.Modules.Shared.Services;
using Microsoft.AspNetCore.Identity;

namespace backend.Modules.Pages.Teacher.Services
{
    public class TeacherPageService : ITeacherPageService
    {
        private readonly ILookUpService _lookUpService;
        private readonly ICourseMetadataService _courseMetadataService;
        private readonly UserManager<ApplicationUser> _userManager;

        public TeacherPageService(ILookUpService lookUpService, ICourseMetadataService courseMetadataService, UserManager<ApplicationUser> userManager)
        {
            _lookUpService = lookUpService;
            _courseMetadataService = courseMetadataService;
            _userManager = userManager;
        }

        public async Task<ServiceResult<CourseBaseCreationPageDTO>> GetCourseCreationPage(CancellationToken ct)
        {
            var currencies = await _lookUpService.GetCurrenciesAsync(ct);
            var languages = await _lookUpService.GetLanguagesAsync(ct);
            var levels = await _courseMetadataService.GetAllLevelsAsync(ct);
            var domains = await _courseMetadataService.GetAllDomainsAsync(ct);

            CourseBaseCreationPageDTO pageDTO = new ()
            {
                Currencies = currencies.Data,
                Domains = domains.Data,
                Levels = levels.Data,
                Languages = languages.Data,

            };

            return ServiceResult<CourseBaseCreationPageDTO>.Success(pageDTO);
            
        }

        public Task<ServiceResult<TeacherHomePageDTO>> GetTeacherHomepage(CancellationToken ct)
        {
            throw new NotImplementedException();
        }
    }
}
