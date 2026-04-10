using backend.Models;
using backend.Modules.Pages.Student.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Modules.Pages.Student.Controllers
{
    [Authorize(Roles = "Student")]
    [ApiController]
    [Route("api/pages/student")]
    public class StudentPageController : ControllerBase
    {
        private readonly IStudentPageService _studentPageService;
        private readonly UserManager<ApplicationUser> _userManager;

        public StudentPageController(IStudentPageService studentPageService, UserManager<ApplicationUser> userManager)
        {
            _studentPageService = studentPageService;
            _userManager = userManager;
        }

        [HttpGet("homepage")]
        public async Task<IActionResult> GetHomePageData(CancellationToken ct)
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
            {
                return NotFound();
            }

            var res = await _studentPageService.GetStudentHomePageAsync(user.Id, ct);
            return res.Succeded ? Ok(res.Data) : StatusCode(res.StatusCode, res.Error);
        }

        [HttpGet("my-courses")]
        public async Task<IActionResult> GetMyCoursesPageData(CancellationToken ct)
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
            {
                return NotFound();
            }

            var res = await _studentPageService.GetStudentMyCoursesPageAsync(user.Id, ct);
            return res.Succeded ? Ok(res.Data) : StatusCode(res.StatusCode, res.Error);
        }

        [HttpGet("walls/{wallId}")]
        public async Task<IActionResult> GetWallPageData(Guid wallId, CancellationToken ct)
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
            {
                return NotFound();
            }

            var res = await _studentPageService.GetTutoringWallData(wallId, user.Id, ct);
            return res.Succeded ? Ok(res.Data) : StatusCode(res.StatusCode, res.Error);
        }
    }
}
