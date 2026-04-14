using backend.Models;
using backend.Modules.Resources.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Modules.Resources.Controllers
{
    [Route("/files")]
    [ApiController]
    public class FileManagerServingController: ControllerBase
    {
        private readonly IFileManagerService _fileManagerService;

        public FileManagerServingController(IFileManagerService fileManagerService)
        {
            _fileManagerService = fileManagerService;
        }


        [HttpGet("{**storagePath}")]
        public async Task<IActionResult> GetFile(string storagePath, CancellationToken ct)
        {
            var result = await _fileManagerService.ServeFile(storagePath, ct);

            if (!result.Succeded || result.Data is null)
                return StatusCode(result.StatusCode, result.Error);

            var isInline = result.Data.MimeType.StartsWith("image/") ||
                   result.Data.MimeType.StartsWith("video/") ||
                   result.Data.MimeType.StartsWith("audio/");

            var contentDisposition = isInline
                ? $"inline; filename=\"{result.Data.OriginalFileName}\""
                : $"attachment; filename=\"{result.Data.OriginalFileName}\"";

            Response.Headers.ContentDisposition = contentDisposition;

            return File(result.Data.Stream, result.Data.MimeType);
        }
    }
}
