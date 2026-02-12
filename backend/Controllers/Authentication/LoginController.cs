using backend.Data;
using backend.Models;
using backend.Services.JwtServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking.Internal;
using Microsoft.IdentityModel.JsonWebTokens;
using System.Security.Claims;

namespace backend.Controllers.Login
{
    [Route("api/auth")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly JwtGenerator _jwtGenerator;
        private readonly UserDbContext _context;
        
        public LoginController(UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            JwtGenerator jwtGenerator,
            UserDbContext context)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _jwtGenerator = jwtGenerator;
            _context = context;
        }



        public record RegisterDTO(string Email, string Password, string Role, string Full_name, string Address, DateTime Date_of_birth, string? Nickname, string? Introduction);

        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody]RegisterDTO register) {

            var newUser = new ApplicationUser()
            {
                UserName = register.Email,
                Email = register.Email,
                FullName = register.Full_name,
                Address = register.Address,
                DateOfBirth = DateTime.SpecifyKind(register.Date_of_birth, DateTimeKind.Utc),
            };

            if (!string.IsNullOrEmpty(register.Nickname)) {
                newUser.Nickname = register.Nickname;
            }
            if (!string.IsNullOrEmpty(register.Introduction))
            {
                newUser.Nickname = register.Introduction;
            }

            var result = await _userManager.CreateAsync(newUser, register.Password);

            if (!result.Succeeded) {
                return BadRequest(result.Errors);
            }

            if (!string.IsNullOrEmpty(register.Role)) {
                await _userManager.AddToRoleAsync(newUser, register.Role);
            }

            return Created();
        }
        

        public record LoginDto(string Email, string Password);

        [HttpPost("login")]
        public async Task<IActionResult> LoginUser([FromBody]LoginDto login) {

            var user = await _userManager.FindByEmailAsync(login.Email);

            if (user == null) {
                return Unauthorized(new { error = "email"});
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, login.Password, false);

            if (!result.Succeeded)
            {
                return Unauthorized(new { error = "password" });
            }

            var roles = await _userManager.GetRolesAsync(user);

            var token = _jwtGenerator.GenerateToken(user, roles);

            var refreshToken = new RefreshToken
            {
                Token = _jwtGenerator.GenerateRefreshToken(),
                UserId = user.Id,
                ExpiresAt = DateTime.UtcNow.AddDays(14),
                CreatedAt = DateTime.UtcNow
            };

            _context.RefreshTokens.Add(refreshToken);

            await _context.SaveChangesAsync();


            Response.Cookies.Append("access_token", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Lax,
                //SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddMinutes(15)
            });
            Response.Cookies.Append("refresh_token", refreshToken.Token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Lax,
                //SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddDays(7)
            });

            return NoContent();
        }

        [HttpGet("refresh")]
        public async Task<IActionResult> RefreshToken()
        {

            var refreshToken = Request.Cookies["refresh_token"];

            var storedToken = _context.RefreshTokens.Include(rt => rt.User)
                .FirstOrDefault(rt => rt.Token == refreshToken && !rt.IsRevoked && rt.ExpiresAt > DateTime.UtcNow);

            if (storedToken == null)
                return Unauthorized();

            var roles = await _userManager.GetRolesAsync(storedToken.User);

            var token = _jwtGenerator.GenerateToken(storedToken.User, roles);
            Response.Cookies.Append("access_token", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Lax,
                //SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddMinutes(15)
            });

            return NoContent();
        }

        [HttpGet("logout")]
        public async Task<IActionResult> Logout() {

            try
            {
                Response.Cookies.Delete("access_token");
                Response.Cookies.Delete("refresh_token");

                return NoContent();
            }
            catch(Exception ex) {
                return BadRequest(new { error = ex.Message });
            }
        }

        [Authorize]
        [HttpDelete("account/delete")]
        public async Task<IActionResult> DeleteAccount() {

            var user = await _userManager.GetUserAsync(User);

            if (user == null)
                return NotFound();

            var result = await _userManager.DeleteAsync(user);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            Response.Cookies.Delete("access_token");
            Response.Cookies.Delete("refresh_token");

            return NoContent();
        }


        public record ModifyDTO(string? Password,string? Full_name, string? Address,string? Nickname, string? Introduction);

        [Authorize]
        [HttpPut("account/modify")]
        public async Task<IActionResult> ModifyUser([FromBody]ModifyDTO modify) {

            var user = await _userManager.GetUserAsync(User);

            if (user == null)
                return NotFound();

            if (!string.IsNullOrEmpty(modify.Full_name))
                user.FullName = modify.Full_name;

            if (!string.IsNullOrEmpty(modify.Address))
                user.Address = modify.Address;

            if (!string.IsNullOrEmpty(modify.Nickname))
                user.Nickname = modify.Nickname;

            if (!string.IsNullOrEmpty(modify.Introduction))
                user.Introduction = modify.Introduction;

            var updateResult = await _userManager.UpdateAsync(user);

            if (!updateResult.Succeeded)
                return BadRequest(updateResult.Errors);

            return NoContent();
        }


        public record ForgetPasswordDTO(string Email);

        [HttpPost("forget-password")]
        public async Task<IActionResult> ForgetPassword([FromBody]ForgetPasswordDTO fpass) {

            if (string.IsNullOrEmpty(fpass.Email))
                return BadRequest(fpass.Email);

            var user = await _userManager.FindByEmailAsync(fpass.Email);

            if (user == null)
                return NotFound();

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            var resetLink = Url.Action("ResetPassword", "Login", new { token, email = fpass.Email }, Request.Scheme);

            if (resetLink == null)
                return BadRequest();

            Console.WriteLine(token);


            return Ok(token);
        }

        public record ResetPasswordDTO(string Email, string Token, string New_password);

        [AllowAnonymous]
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDTO dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
                return NotFound();

            var result = await _userManager.ResetPasswordAsync(user, dto.Token, dto.New_password);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            
            //_context.RefreshTokens.RemoveRange(_context.RefreshTokens.Where(x => x.UserId == user.Id));
            //await _context.SaveChangesAsync();

            return Ok("Password has been reset successfully.");
        }


        [Authorize(Roles = "Teacher")]
        [HttpGet("proba")]
        public async Task<IActionResult> Proba() {

            return Ok();
        }

    }
}
