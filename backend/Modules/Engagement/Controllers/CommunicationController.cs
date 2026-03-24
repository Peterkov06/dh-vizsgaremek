using backend.Models;
using backend.Modules.Engagement.DTOs;
using backend.Modules.Engagement.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Modules.Engagement.Controllers
{
    [ApiController]
    [Route("api/communication")]
    public class CommunicationController: ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ICommunicationService _communicationService;

        public CommunicationController(ICommunicationService communicationService, UserManager<ApplicationUser> userManager)
        {
            _communicationService = communicationService;
            _userManager = userManager;
        }

        [HttpPost("write_review")]
        public async Task<IActionResult> WriteReview([FromBody] CourseReviewCreatorDTO dto, string userId, CancellationToken ct)
        {
            var res = await _communicationService.WriteCourseReview(dto, userId, ct);
            return res.Succeded ? Ok(res.Data) : StatusCode(res.StatusCode, res.Error);
        }
    }
}
