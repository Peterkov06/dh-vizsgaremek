using backend.Modules.Pages.Teacher.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Modules.Pages.Teacher.Controllers
{
    [ApiController]
    [Route("api/pages/teacher")]
    public class TeacherPageController: ControllerBase
    {
        private readonly ITeacherPageService _teacherPageService;

        public TeacherPageController(ITeacherPageService teacherPageService)
        {
            _teacherPageService = teacherPageService;
        }

        [HttpGet("course-creator")]
        public async Task<IActionResult> GetCourseCreatorPage(CancellationToken ct)
        {
            var res = await _teacherPageService.GetCourseCreationPage(ct);
            return res.Succeded ? Ok(res.Data) : StatusCode(res.StatusCode, res.Error);
        }
    }
}
