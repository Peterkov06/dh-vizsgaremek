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

            return Ok();
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

            return Ok();
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

            return Ok();
        }

        [HttpGet("logout")]
        public async Task<IActionResult> Logout() {

            try
            {
                Response.Cookies.Delete("access_token");
                Response.Cookies.Delete("refresh_token");

                return Ok();
            }
            catch(Exception ex) {
                return BadRequest(new { error = ex.Message });
            }
        }

        [Authorize(Roles = "Teacher")]
        [HttpGet("proba")]
        public async Task<IActionResult> Proba() {

            return Ok();
        }

    }
}
