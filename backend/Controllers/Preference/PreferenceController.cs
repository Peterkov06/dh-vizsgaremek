using backend.Data;
using backend.Models.Preferances;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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



    }
}
