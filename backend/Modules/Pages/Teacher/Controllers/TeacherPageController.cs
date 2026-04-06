using backend.Models;
using backend.Modules.Pages.Teacher.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Modules.Pages.Teacher.Controllers
{
    [ApiController]
    [Route("api/pages/teacher")]
    public class TeacherPageController: ControllerBase
    {
        private readonly ITeacherPageService _teacherPageService;
        private readonly UserManager<ApplicationUser> _userManager;

        public TeacherPageController(ITeacherPageService teacherPageService,UserManager<ApplicationUser> userManager)
        {
            _teacherPageService = teacherPageService;
            _userManager = userManager;
        }

        [HttpGet("course-creator")]
        public async Task<IActionResult> GetCourseCreatorPage(CancellationToken ct)
        {
            var res = await _teacherPageService.GetCourseCreationPage(ct);
            return res.Succeded ? Ok(res.Data) : StatusCode(res.StatusCode, res.Error);
        }

        [HttpGet("homepage")]
        public async Task<IActionResult> GetHomepageAsync(CancellationToken ct)
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
            {
                return NotFound();
            }

            var res = await _teacherPageService.GetTeacherHomepage(user.Id, ct);
            return res.Succeded ? Ok(res.Data) : StatusCode(res.StatusCode, res.Error);
        }

        [HttpGet("my-students")]
        public async Task<IActionResult> GetStudentsAsync(CancellationToken ct)
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
            {
                return NotFound();
            }

            var res = await _teacherPageService.GetStudentsPage(user.Id, ct);
            return res.Succeded ? Ok(res.Data) : StatusCode(res.StatusCode, res.Error);
        }
    }
}
