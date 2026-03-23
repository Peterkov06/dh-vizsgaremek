using backend.Modules.CoursesBase.DTOs;
using backend.Modules.CoursesBase.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Modules.CoursesBase.Controllers
{
    [ApiController]
    [Route("api/courses")]
    public class CourseBaseController : ControllerBase
    {
        private readonly ICourseBaseService _courseBaseService;

        public CourseBaseController(ICourseBaseService courseBaseService)
        {
            _courseBaseService = courseBaseService;
        }

        [HttpPost("add")]
        public async Task<IActionResult> CreateCourse(CourseBaseCreationDTO newCourse, CancellationToken ct)
        {
            var res = await _courseBaseService.CreateCourseBaseAsync(newCourse, ct);
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
    }
}
