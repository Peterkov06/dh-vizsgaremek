using backend.Models;
using backend.Modules.CoursesBase.Services;
using backend.Modules.Engagement.Models;
using backend.Modules.Engagement.Services;
using backend.Modules.Identity.Models;
using backend.Modules.Tutoring.DTOs;
using backend.Modules.Tutoring.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Modules.Tutoring.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/tutoring")]
    public class TutoringController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ITutoringManagementService _tutoringManagementService;
        private readonly ITutoringWallService _wallService;
        private readonly INotificationService _notificationService;
        private readonly ICourseBaseService _courseBaseService;
        private readonly ICommunicationService _communicationService;

        public TutoringController(ITutoringManagementService tutoringManagementService, ITutoringWallService wallService, UserManager<ApplicationUser> userManager, INotificationService notificationService, ICourseBaseService courseBaseService, ICommunicationService communicationService)
        {
            _tutoringManagementService = tutoringManagementService;
            _wallService = wallService;
            _userManager = userManager;
            _notificationService = notificationService;
            _courseBaseService = courseBaseService;
            _communicationService = communicationService;
        }

        [Authorize(Roles = "Student")]
        [HttpPost("enrollment")]
        public async Task<IActionResult> EnrollToTutoring([FromBody] TutoringWallEnrollmentDTO enrollmentDTO, CancellationToken ct)
        {
            var user = await _userManager.GetUserAsync(User);

            if (user is null)
            {
                return NotFound();
            }

            var res = await _tutoringManagementService.ApplyToCourse(enrollmentDTO, user.Id, ct);
            return res.Succeded ? Ok(res.Data) : StatusCode(res.StatusCode, res.Error);
        }

        [Authorize(Roles = "Teacher")]
        [HttpPatch("enrollment/react")]
        public async Task<IActionResult> ReactToEnrollment([FromBody] EnrollmentResponseDTO responseDTO, CancellationToken ct)
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
            {
                return NotFound();
            }

            var res = await _tutoringManagementService.RespondToApplication(responseDTO, user.Id, ct);

            if (!res.Succeded || res.Data is null)
            {
                return StatusCode(res.StatusCode, res.Error);
            }

            var studentId = res.Data;

            if (responseDTO.Accepted)
            {
                await _communicationService.CreateChat(user.Id, studentId, ct);
            }

            return NoContent();
        }

        [Authorize(Roles = "Teacher")]
        [HttpGet("enrollment/teacher")]
        public async Task<IActionResult> GetEnrollments(CancellationToken ct)
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
            {
                return NotFound();
            }

            var res = await _tutoringManagementService.GetTeacherEnrollments(user.Id, ct);
            return res.Succeded ? Ok(res.Data) : StatusCode(res.StatusCode, res.Error);
        }

        [HttpGet("{wallId:guid}/posts")]
        public async Task<IActionResult> GetWallPosts(Guid wallId, CancellationToken ct)
        {
            var res = await _wallService.GetWallPosts(wallId, ct);
            return res.Succeded ? Ok(res.Data) : StatusCode(res.StatusCode, res.Error);
        }

        [HttpGet("{wallId:guid}/{postId:guid}")]
        public async Task<IActionResult> GetOneWallPost(Guid wallId, Guid postId, CancellationToken ct)
        {
            var res = await _wallService.GetOneWallPost(wallId, postId, ct);
            return res.Succeded ? Ok(res.Data) : StatusCode(res.StatusCode, res.Error);
        }

        [Authorize(Roles = "Teacher")]
        [HttpPost("wall/post")]
        public async Task<IActionResult> PostOnWall([FromBody] NewWallPostDTO postDTO, CancellationToken ct)
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
            {
                return NotFound();
            }

            var res = await _wallService.PostOnWall(postDTO, user.Id, ct);

            return res.Succeded ? Created(string.Empty, res.Data) : StatusCode(res.StatusCode, res.Error);
        }

        [HttpPost("wall/post/comment")]
        public async Task<IActionResult> CommentOnWall(PostCommentCreationDTO commentCreationDTO, CancellationToken ct)
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
            {
                return NotFound();
            }

            var res = await _wallService.CommentOnPost(commentCreationDTO, user.Id, ct);
            return res.Succeded ? Created(string.Empty, res.Data) : StatusCode(res.StatusCode, res.Error);
        }
    }
}
