using backend.Models;
using backend.Modules.Engagement.DTOs;
using backend.Modules.Engagement.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Modules.Engagement.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/communication")]
    public class CommunicationController: ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ICommunicationService _communicationService;
        private readonly INotificationService _notificationService;

        public CommunicationController(ICommunicationService communicationService, UserManager<ApplicationUser> userManager, INotificationService notificationService)
        {
            _communicationService = communicationService;
            _userManager = userManager;
            _notificationService = notificationService;
        }

        [Authorize(Roles = "Student")]
        [HttpPost("write_review")]
        public async Task<IActionResult> WriteReview([FromBody] CourseReviewCreatorDTO dto, CancellationToken ct)
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
            {
                return NotFound();
            }

            var res = await _communicationService.WriteCourseReview(dto, user.Id, ct);
            return res.Succeded ? Created(string.Empty, res.Data) : StatusCode(res.StatusCode, res.Error);
        }

        [HttpGet("notifications")]
        public async Task<IActionResult> GetNotifications(CancellationToken ct)
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
            {
                return NotFound();
            }

            var res = await _notificationService.GetUserNotifications(user.Id, ct);
            if (res.Succeded && res.Data.Count > 0)
            {
                var unreadIDs = res.Data.Where(x => x.IsRead == false).Select(x => x.Id).ToList();
                await _notificationService.SetNotificationsToRead(unreadIDs, ct);
            }
            return res.Succeded ? Ok(res.Data) : StatusCode(res.StatusCode, res.Error);
        }
    }
}
