using backend.Models;
using backend.Modules.Engagement.Services;
using backend.Modules.Identity.Models;
using backend.Modules.Scheduling.DTOs;
using backend.Modules.Scheduling.Models;
using backend.Modules.Scheduling.Services;
using backend.Modules.Shared.Results;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Modules.Scheduling.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/scheduling")]
    public class SchedulingController: ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ISchedulingService _schedulingService;

        public SchedulingController(UserManager<ApplicationUser> userManager, ISchedulingService schedulingService)
        {
            _userManager = userManager;
            _schedulingService = schedulingService;
        }

        [HttpPost("week-free-timeblocks")]
        public async Task<IActionResult> SetAvailableTimeblocks([FromBody] AvailableTimeblockCreationDTO dto, CancellationToken ct)
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
            {
                return NotFound();
            }

            var res = await _schedulingService.CreateAvailableBlocks(user.Id, dto, ct);
            return res.Succeded ? Created() : StatusCode(res.StatusCode, res.Error);
        }

        [HttpPost("book-event")]
        public async Task<IActionResult> BookEvent(BookingDTO dto, CancellationToken ct)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return NotFound();
            }
            var userRoles = await _userManager.GetRolesAsync(user);
            if (userRoles.Count != 1)
            {
                return NotFound("Invalid user");
            }
            var userRole = userRoles.Single();

            var res = await _schedulingService.BookEvent(user.Id, userRole, dto, ct);

            return res.Succeded ? Created() : StatusCode(res.StatusCode, res.Error);
        }

        [HttpGet("{teacherId}/free-days")]
        public async Task<IActionResult> GetAvailableDays(string teacherId, [FromQuery] DateTime searchDate , CancellationToken ct)
        {
            var res = await _schedulingService.GetAvailableDays(teacherId, searchDate, ct);
            return res.Succeded ? Created(string.Empty, res.Data) : StatusCode(res.StatusCode, res.Error);
        }

        [HttpGet("{teacherId}/free-times")]
        public async Task<IActionResult> GetAvailableTimes(string teacherId, [FromQuery] DateTime searchDate, [FromQuery] Guid CourseId, [FromQuery] int LessonNumber, CancellationToken ct)
        {
            var res = await _schedulingService.GetAvailableTimes(teacherId, CourseId, LessonNumber, searchDate, ct);
            return res.Succeded ? Created(string.Empty, res.Data) : StatusCode(res.StatusCode, res.Error);
        }

        [HttpGet("week-free-timeblocks")]
        public async Task<IActionResult> GetWeekBlocks([FromQuery] DateTime searchDate, CancellationToken ct)
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
            {
                return NotFound();
            }

            var res = await _schedulingService.GetCurrentTimeBlocks(user.Id, searchDate, ct);
            return res.Succeded ? Ok(res.Data) : StatusCode(res.StatusCode, res.Error);
        }

        [HttpGet("get-events")]
        public async Task<IActionResult> GetWeekEvents([FromQuery] DateTime searchDate, [FromQuery] SearchTimeLength searchLength, CancellationToken ct)
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
            {
                return NotFound();
            }

            var res = await _schedulingService.GetEvents(user.Id, searchDate, searchLength, ct);
            return res.Succeded ? Ok(res.Data) : StatusCode(res.StatusCode, res.Error);
        }

        [HttpDelete("week-free-timeblocks/{blockId}")]
        public async Task<IActionResult> DeleteTimeblock(Guid blockId, CancellationToken ct)
        {
            var res = await _schedulingService.DeleteTimeblock(blockId, ct);
            return res.Succeded ? NoContent() : StatusCode(res.StatusCode, res.Error);
        }

        [HttpDelete("events/{eventId}")]
        public async Task<IActionResult> DeleteEvent(Guid eventId, CancellationToken ct)
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
            {
                return NotFound();
            }
            var userRoles = await _userManager.GetRolesAsync(user);

            if (userRoles.Count != 1)
            {
                return NotFound("Invalid user");
            }

            var userRole = userRoles.Single();


            var res = await _schedulingService.DeleteBookedEvent(user.Id, userRole, eventId, ct);
            return res.Succeded ? NoContent() : StatusCode(res.StatusCode, res.Error);
        }
    }
}
