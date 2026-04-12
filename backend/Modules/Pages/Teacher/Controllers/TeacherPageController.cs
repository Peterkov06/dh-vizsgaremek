using backend.Models;
using backend.Modules.Pages.Teacher.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Modules.Pages.Teacher.Controllers
{
    [Authorize(Roles = "Teacher")]
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
        public async Task<IActionResult> GetStudentsAsync(CancellationToken ct, [FromQuery] string? searchText = null)
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
            {
                return NotFound();
            }

            var res = await _teacherPageService.GetStudentsPage(user.Id, ct, searchText);
            return res.Succeded ? Ok(res.Data) : StatusCode(res.StatusCode, res.Error);
        }

        [HttpGet("my-courses")]
        public async Task<IActionResult> GetCoursesAsync(CancellationToken ct, [FromQuery] string? searchText = null)
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
            {
                return NotFound();
            }

            var res = await _teacherPageService.GetMyCoursesPage(user.Id, ct, searchText);
            return res.Succeded ? Ok(res.Data) : StatusCode(res.StatusCode, res.Error);
        }

        [HttpGet("courses/{courseId}/students")]
        public async Task<IActionResult> GetCoursesAsync(Guid courseId, CancellationToken ct, [FromQuery] string? searchText = null)
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
            {
                return NotFound();
            }

            var res = await _teacherPageService.GetTutoringStudents(user.Id, courseId, searchText, ct);
            return res.Succeded ? Ok(res.Data) : StatusCode(res.StatusCode, res.Error);
        }

        [HttpGet("walls/{wallId}")]
        public async Task<IActionResult> GetWallData(Guid wallId, CancellationToken ct)
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
            {
                return NotFound();
            }

            var res = await _teacherPageService.GetTutoringWallData(wallId, ct);
            return res.Succeded ? Ok(res.Data) : StatusCode(res.StatusCode, res.Error);
        }

        [HttpGet("invoices")]
        public async Task<IActionResult> GetInvoicesPageData(CancellationToken ct)
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
            {
                return NotFound();
            }

            var res = await _teacherPageService.GetInvoicesPage(user.Id, ct);
            return res.Succeded ? Ok(res.Data) : StatusCode(res.StatusCode, res.Error);
        }

    }
}
