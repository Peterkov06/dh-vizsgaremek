using backend.Modules.Tutoring.DTOs;
using backend.Modules.Tutoring.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Modules.Tutoring.Controllers
{
    [ApiController]
    [Route("api/tutoring")]
    public class TutoringController:ControllerBase
    {
        private readonly ITutoringManagementService _tutoringManagementService;

        public TutoringController(ITutoringManagementService tutoringManagementService)
        {
            _tutoringManagementService = tutoringManagementService;
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

    }
}
