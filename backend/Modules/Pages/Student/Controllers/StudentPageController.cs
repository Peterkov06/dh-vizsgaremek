using backend.Modules.Pages.Student.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Modules.Pages.Student.Controllers
{
    [ApiController]
    [Route("api/pages/student")]
    public class StudentPageController : ControllerBase
    {
        private readonly IStudentPageService _studentPageService;

        public StudentPageController(IStudentPageService studentPageService)
        {
            _studentPageService = studentPageService;
        }

        [HttpGet("homepage")]
        public async Task<IActionResult> GetHomePageData([FromQuery] string userId , CancellationToken ct)
        {
            var res = await _studentPageService.GetStudentHomePageAsync(userId, ct);
            return res.Succeded ? Ok(res.Data) : StatusCode(res.StatusCode, res.Error);
        }

        [HttpGet("my-courses")]
        public async Task<IActionResult> GetMyCoursesPageData([FromQuery] string userId, CancellationToken ct)
        {
            var res = await _studentPageService.GetStudentMyCoursesPageAsync(userId, ct);
            return res.Succeded ? Ok(res.Data) : StatusCode(res.StatusCode, res.Error);
        }
    }
}
