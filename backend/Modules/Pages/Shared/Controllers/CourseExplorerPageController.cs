using backend.Modules.Pages.Shared.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Modules.Pages.Shared.Controllers
{
    [ApiController]
    [Route("api/pages/course-explorer")]
    public class CourseExplorerPageController : ControllerBase
    {
        private readonly ICourseExplorerPageService _courseExplorerPageService;

        public CourseExplorerPageController(ICourseExplorerPageService courseExplorerPageService)
        {
            _courseExplorerPageService = courseExplorerPageService;
        }

        [HttpGet]
        public async Task<IActionResult> GetCourseExplorerPageData(CancellationToken ct)
        {
            var res = await _courseExplorerPageService.GetExplorerPage(ct);
            return res.Succeded ? Ok(res.Data) : StatusCode(res.StatusCode, res.Error);
        }
    }
}
