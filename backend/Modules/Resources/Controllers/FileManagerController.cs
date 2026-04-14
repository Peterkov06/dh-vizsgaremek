using backend.Models;
using backend.Modules.Resources.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Modules.Resources.Controllers
{
    [ApiController]
    [Route("api/files")]
    public class FileManagerController:ControllerBase
    {
        private readonly IFileManagerService _fileManagerService;
        private readonly UserManager<ApplicationUser> _userManager;

        public FileManagerController(IFileManagerService fileManagerService, UserManager<ApplicationUser> userManager)
        {
            _fileManagerService = fileManagerService;
            _userManager = userManager;
        }

        [HttpPost("profile-picture")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadProfilePicture([FromForm] IFormFile picture, CancellationToken ct)
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
            {
                return NotFound();
            }

            var res = await _fileManagerService.ChangeProfilePicture(user.Id, picture, ct);
            return res.Succeded ? Ok() : StatusCode(res.StatusCode, res.Error);
        }
    }
}
