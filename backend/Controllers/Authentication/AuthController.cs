using backend.Data;
using backend.Models;
using backend.Models.Cities;
using backend.Modules.Identity.Models;
using backend.Services.JwtServices;
using backend.Services.SendEmail;
using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking.Internal;
using Microsoft.IdentityModel.JsonWebTokens;
using MimeKit;
using System.Security.Claims;

namespace backend.Controllers.Login
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly JwtGenerator _jwtGenerator;
        //private readonly EmailSender _emailSender;
        private readonly AppDbContext _context;
        
        public AuthController(UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            JwtGenerator jwtGenerator,
            //EmailSender emailSender,
            AppDbContext context)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _jwtGenerator = jwtGenerator;
            //_emailSender = emailSender;
            _context = context;
        }

        public record RegisterDTO(string Email, string Password, string Role, string Full_name, string Address,string City, string Postal_code, DateTime Date_of_birth, string? Nickname, string? Introduction);

        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody]RegisterDTO register) {

            var newUser = new ApplicationUser()
            {
                UserName = register.Email,
                Email = register.Email,
                FullName = register.Full_name,
                Address = register.Address,
                City = register.City,
                PostalCode = register.Postal_code,
                ProfilePictureId = null,
                DateOfBirth = DateTime.SpecifyKind(register.Date_of_birth, DateTimeKind.Utc),
            };

            if (!string.IsNullOrEmpty(register.Nickname)) {
                newUser.Nickname = register.Nickname;
            }
            if (!string.IsNullOrEmpty(register.Introduction))
            {
                newUser.Introduction = register.Introduction;
            }

            var result = await _userManager.CreateAsync(newUser, register.Password);

            if (!result.Succeeded) {
                return BadRequest(result.Errors);
            }

            if (!string.IsNullOrEmpty(register.Role)) {
                await _userManager.AddToRoleAsync(newUser, register.Role);
                switch (register.Role)
                {
                    case "Teacher":
                        _context.Teachers.Add(new Teacher {TeacherId = newUser.Id });
                        break;
                    case "Student":
                        _context.Students.Add(new Student { UserId = newUser.Id });
                        break;
                    default:
                        break;
                }
                await _context.SaveChangesAsync();
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
                SameSite = SameSiteMode.None,
                //SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddMinutes(15)
            });
            Response.Cookies.Append("refresh_token", refreshToken.Token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                //SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddDays(7)
            });

            return NoContent();
        }

        [HttpGet("refresh")]
        public async Task<IActionResult> RefreshToken()
        {

            var refreshToken = Request.Cookies["refresh_token"];

            if (refreshToken == null)
                return BadRequest();

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
                SameSite = SameSiteMode.None,
                //SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddMinutes(15)
            });

            return NoContent();
        }

        [Authorize]
        [HttpGet("logout")]
        public async Task<IActionResult> Logout() {

            try
            {
                Response.Cookies.Delete("access_token");
                Response.Cookies.Delete("refresh_token");

                var user = await _userManager.GetUserAsync(User);

                if (user == null)
                    return NotFound();

                _context.RefreshTokens.RemoveRange(_context.RefreshTokens.Where(x => x.UserId == user.Id));
                await _context.SaveChangesAsync();

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
            _context.RefreshTokens.RemoveRange(_context.RefreshTokens.Where(x => x.UserId == user.Id));
            await _context.SaveChangesAsync();

            return NoContent();
        }


        public record ModifyDTO(string? Password,string? Full_name, string? Address,string? City, string? Postal_code, string? Nickname, string? Introduction);

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
           
            if (!string.IsNullOrEmpty(modify.City))
                user.City = modify.City;

            if (!string.IsNullOrEmpty(modify.Postal_code))
                user.PostalCode = modify.Postal_code;

            if (!string.IsNullOrEmpty(modify.Nickname))
                user.Nickname = modify.Nickname;

            if (!string.IsNullOrEmpty(modify.Introduction))
                user.Introduction = modify.Introduction;

            var updateResult = await _userManager.UpdateAsync(user);

            if (!updateResult.Succeeded)
                return BadRequest(updateResult.Errors);

            return NoContent();
        }

        [HttpGet("validate/email")]
        public async Task<IActionResult> ValidateEmail([FromQuery]string email) {

            var user = await _userManager.FindByEmailAsync(email);

            if (user != null) {
                return Ok(true);
            }

            return Ok(false);
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> UserProfile() {

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            if (userId == null)
                return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return BadRequest();
            var roleList = await _userManager.GetRolesAsync(user);
            if (roleList.Count() < 1) {
                return BadRequest();
            }
            var role = roleList[0];

            return Ok(new { user.Email, role,user.FullName, user.ProfilePictureId, user.Nickname});
        }

        [Authorize]
        [HttpGet("me/all")]
        public async Task<IActionResult> UserProfileAll()
        {

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            if (userId == null)
                return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return BadRequest();
            var roleList = await _userManager.GetRolesAsync(user);
            if (roleList.Count() < 1)
            {
                return BadRequest();
            }
            var role = roleList[0];

            return Ok(new { user, role });
        }

        [Authorize]
        [HttpGet("validate")]
        public async Task<IActionResult> ValidateUser() {
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

            var resetLink = $"http://localhost:3000/password-recovery?token={token}&email={fpass.Email}";

            if (resetLink == null)
                return BadRequest();

            Console.WriteLine("vami");
            await SendEmail(fpass.Email, resetLink);


            return Ok(token);
        }


        public async Task SendEmail(string toEmail, string resetLink)
        {
            try
            {
                string _smtpHost = "localhost";
                int _smtpPort = 1025;
                var emailMessage = new MimeMessage();
                emailMessage.From.Add(new MailboxAddress("MyApp", "uzlettiember@gmail.com"));
                emailMessage.To.Add(MailboxAddress.Parse(toEmail));
                emailMessage.Subject = "Reset Your Password";
                emailMessage.Body = new TextPart("plain") { Text = $"Click here to reset your password: {resetLink}" };

                using var client = new SmtpClient();
                await client.ConnectAsync(_smtpHost, _smtpPort, MailKit.Security.SecureSocketOptions.None);

                await client.SendAsync(emailMessage);
                await client.DisconnectAsync(true);
            }
            catch (Exception ex){
                Console.WriteLine(ex.Message);
            }
        }

        public record ResetPasswordDTO(string Email, string Token, string New_password);

        [AllowAnonymous]
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDTO dto)
        {
            Console.WriteLine(dto.Email);
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
                return NotFound();
            Console.WriteLine(dto.Token);

            var result = await _userManager.ResetPasswordAsync(user, dto.Token, dto.New_password);
            if (!result.Succeeded)
                return BadRequest(result.Errors);
            Console.WriteLine("3");


            _context.RefreshTokens.RemoveRange(_context.RefreshTokens.Where(x => x.UserId == user.Id));
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("google-login")]
        public async Task<IActionResult> GoogleLogin() {

            var properties = _signInManager.ConfigureExternalAuthenticationProperties("Google", "/api/auth/google-callback");

            return Challenge(properties, "Google");
        }

        [HttpGet("google-callback")]
        public async Task<IActionResult> GoogleCallback() {


            var info = await _signInManager.GetExternalLoginInfoAsync();
            if (info == null) {

                Console.WriteLine("No");
                return Redirect($"https://localhost:3000/login");
                    }

            var email = info.Principal.FindFirstValue(ClaimTypes.Email);

            Console.WriteLine(email);
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null) {
                return Redirect($"https://localhost:3000/login?error=failed");
            }
            return Redirect($"https://localhost:3000/dashboard");
        }
    }
}
