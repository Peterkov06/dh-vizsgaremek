using backend.Modules.Tutoring.DTOs;
using backend.Modules.Tutoring.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Modules.Tutoring.Controllers
{
    [ApiController]
    [Route("api/tutoring")]
    public class TutoringController : ControllerBase
    {
        private readonly ITutoringManagementService _tutoringManagementService;
        private readonly ITutoringWallService _wallService;

        public TutoringController(ITutoringManagementService tutoringManagementService, ITutoringWallService wallService)
        {
            _tutoringManagementService = tutoringManagementService;
            _wallService = wallService;
        }

        [HttpPost("enrollment")]
        public async Task<IActionResult> EnrollToTutoring([FromBody] TutoringWallEnrollmentDTO enrollmentDTO, CancellationToken ct)
        {
            var res = await _tutoringManagementService.ApplyToCourse(enrollmentDTO, ct);
            return res.Succeded ? CreatedAtAction("Enrollment", res.Data) : StatusCode(res.StatusCode, res.Error);
        }

        [HttpPatch("enrollment/react")]
        public async Task<IActionResult> ReactToEnrollment([FromBody] EnrollmentResponseDTO responseDTO, CancellationToken ct)
        {
            var res = await _tutoringManagementService.RespondToApplication(responseDTO, ct);
            return res.Succeded ? NoContent() : StatusCode(res.StatusCode, res.Error);
        }

        [HttpGet("enrollment/teacher")]
        public async Task<IActionResult> GetEnrollments([FromQuery] string teacherId, CancellationToken ct)
        {
            var res = await _tutoringManagementService.GetTeacherEnrollments(teacherId, ct);
            return res.Succeded ? Ok(res.Data) : StatusCode(res.StatusCode, res.Error);
        }

        [HttpGet("wall/posts")]
        public async Task<IActionResult> GetWallPosts([FromQuery] Guid wallId, CancellationToken ct)
        {
            var res = await _wallService.GetWallPosts(wallId, ct);
            return res.Succeded ? Ok(res.Data) : StatusCode(res.StatusCode, res.Error);

        }

        [HttpPost("wall/post")]
        public async Task<IActionResult> PostOnWall([FromBody] NewWallPostDTO postDTO, [FromQuery] string posterId, CancellationToken ct)
        {
            var res = await _wallService.PostOnWall(postDTO, posterId, ct);
            return res.Succeded ? CreatedAtAction("PostOnWall", res.Data) : StatusCode(res.StatusCode, res.Error);
        }
    }
}
