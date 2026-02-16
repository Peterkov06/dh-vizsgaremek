using backend.Data;
using backend.Models.Preferances;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using System.Security.Claims;

namespace backend.Controllers.Preference
{
    [Route("api/preferences")]
    [ApiController]
    public class PreferenceController : ControllerBase
    {
        private readonly UserDbContext _context;

        public PreferenceController(UserDbContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("add/new/group")]
        public async Task<IActionResult> AddNewGroup([FromQuery]string name) {
            
            if (string.IsNullOrEmpty(name))
                return BadRequest();

            _context.PreferenceGroups.Add(new PreferenceGroup { 
                Name = name
            } );

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("all/group")]
        public async Task<IActionResult> AllGroup() {

            var preferenceGroups = _context.PreferenceGroups.Select(p=> new { p.Id, p.Name }).ToList();

            if (preferenceGroups == null)
                return BadRequest();

            return Ok(preferenceGroups);
        }

        public record NewPref(string Name, string Group_name);

        [Authorize(Roles = "Admin")]
        [HttpPost("add/new")]
        public async Task<IActionResult> AddNewPref([FromBody]NewPref body) {

            var group = _context.PreferenceGroups.FirstOrDefault(g => g.Name.ToLower() == body.Group_name.ToLower());

            if (group == null)
                return BadRequest();

            _context.Preferences.Add(new Models.Preferances.Preference {
                Name = body.Name,
                PreferenceGroupId = group.Id,
            });

            await _context.SaveChangesAsync();


            return NoContent();
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllPref() {

            var prefs = _context.Preferences.Select(p => new { p.Id, p.Name, p.PreferenceGroupId}).ToList();

            if (prefs == null)
                return BadRequest();

            return Ok(prefs);
        }

        [HttpGet("all/by_group")]
        public async Task<IActionResult> GetSpecPref([FromQuery]string group)
        {
            var TheGroup = _context.PreferenceGroups.FirstOrDefault(g => g.Name.ToLower() == group.ToLower());

            if (TheGroup == null)
                return NotFound();

            var prefs = _context.Preferences.Where(p=>p.PreferenceGroupId == TheGroup.Id).Select(p => new { p.Id, p.Name, p.PreferenceGroupId }).ToList();

            if (prefs == null)
                return BadRequest();

            return Ok(prefs);
        }


        [Authorize]
        [HttpPost("add/to_user")]
        public async Task<IActionResult> AddToUser([FromQuery]int preferenceId) {

            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);

                if (userId == null)
                    return Unauthorized();

                var userPref = new UserPreference
                {
                    UserId = userId,
                    PreferenceId = preferenceId
                };

                _context.UserPreferences.Add(userPref);

                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex) {
                return BadRequest(ex.Message);
            }
        }

        [Authorize]
        [HttpGet("all/user")]
        public async Task<IActionResult> GetAlluserPref() {

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            if (userId == null)
                return Unauthorized();

            var userPrefs = _context.UserPreferences.Where(pref => pref.UserId == userId).Select(p=>p.PreferenceId).ToList();

            if (userPrefs == null)
                return NotFound();

            var prefs = _context.Preferences.Where(p => userPrefs.Contains(p.Id)).Select(p => new { p.Id, p.Name, p.PreferenceGroupId }).ToList();

            if (prefs == null)
                return BadRequest();


            return Ok(prefs);
        }
    }
}
