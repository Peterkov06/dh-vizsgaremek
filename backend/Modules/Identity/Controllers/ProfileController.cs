using backend.Models;
using backend.Modules.Identity.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Modules.Identity.Controllers
{
    [ApiController]
    [Route("api/identity")]
    public class ProfileController: ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IProfileService _profileService;

        public ProfileController(UserManager<ApplicationUser> userManager, IProfileService profileService)
        {
            _userManager = userManager;
            _profileService = profileService;
        }

        [HttpGet("profile/{Id}")]
        public async Task<IActionResult> GetProfileData(string Id, CancellationToken ct)
        {
            var user = await _userManager.FindByIdAsync(Id);

            if (user == null)
            {
                return NotFound();
            }

            var roles = await _userManager.GetRolesAsync(user);
            var role = roles.FirstOrDefault();

            switch (role)
            {
                case "Student":
                    var resStud = await _profileService.GetStudentProfile(Id, ct);
                    return resStud.Succeded ? Ok(resStud.Data) : StatusCode(resStud.StatusCode, resStud.Error);
                case "Teacher":
                    var res = await _profileService.GetTeacherProfile(Id, ct);
                    return res.Succeded ? Ok(res.Data) : StatusCode(res.StatusCode, res.Error);
                default:
                    return Unauthorized();
            }
        }
    }
}
