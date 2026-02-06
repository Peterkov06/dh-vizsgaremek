using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers.Login
{
    [Route("api/auth")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private UserManager<ApplicationUser> _userManager;

        public LoginController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }


        public record RegisterDTO(string Email, string Password, string Role, string Full_name, string Address, DateTime Date_of_birth, string? Nickname);

        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody]RegisterDTO register) {

            var newUser = new ApplicationUser()
            {
                Email = register.Email,
                FullName = register.Full_name,
                Address = register.Address,
                DateOfBirth = register.Date_of_birth
            };

            if (!string.IsNullOrEmpty(register.Nickname)) {
                newUser.Nickname = register.Nickname;
            }

            var result = await _userManager.CreateAsync(newUser, register.Password);

            if (!result.Succeeded) {
                return BadRequest(result.Errors);
            }

            if (!string.IsNullOrEmpty(register.Role)) {
                await _userManager.AddToRoleAsync(newUser, register.Role);
            }

            return Ok(new { message= "User successfully created!"});
        }
    }
}
