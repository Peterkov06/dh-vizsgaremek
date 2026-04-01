using backend.Models;
using backend.Modules.CoursesBase.DTOs;
using backend.Modules.CoursesBase.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Modules.CoursesBase.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/courses")]
    public class CourseBaseController : ControllerBase
    {
        private readonly ICourseBaseService _courseBaseService;
        private readonly UserManager<ApplicationUser> _userManager;

        public CourseBaseController(UserManager<ApplicationUser> userManager, ICourseBaseService courseBaseService)
        {
            _userManager = userManager;
            _courseBaseService = courseBaseService;
        }

        [HttpPost("add")]
        public async Task<IActionResult> CreateCourse(CourseBaseCreationDTO newCourse, CancellationToken ct)
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
            {
                return NotFound();
            }

            var res = await _courseBaseService.CreateCourseBaseAsync(newCourse, user.Id, ct);
            return res.Succeded ? CreatedAtAction(nameof(GetAllCourses), res.Data) : StatusCode(res.StatusCode, res.Error);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllCourses(CancellationToken ct)
        {
            var res = await _courseBaseService.GetAllCourses(ct);
            return Ok(res.Data);
        }

        [HttpGet]
        public async Task<IActionResult> GetCoursesPage([FromQuery] CourseFiltersDTO filters, CancellationToken ct)
        {
            var res = await _courseBaseService.GetCoursesPage(filters, ct);
            return Ok(res.Data);

        }

        [HttpGet("{courseId:guid}")]
        public async Task<IActionResult> GetOneCoursePage(Guid courseId, CancellationToken ct)
        {
            var res = await _courseBaseService.GetOneCourse(courseId, ct);
            return Ok(res.Data);

        }
    }
}
