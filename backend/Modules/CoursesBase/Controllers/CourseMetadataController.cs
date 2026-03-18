using backend.Modules.CoursesBase.Services;
using backend.Modules.Shared.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace backend.Modules.CoursesBase.Controllers
{
    [ApiController]
    [Route("api/courses/metadata")]
    public class CourseMetadataController: ControllerBase
    {
        private readonly ICourseMetadataService _courseMetadataService;

        public CourseMetadataController(ICourseMetadataService courseMetadataService)
        {
            _courseMetadataService = courseMetadataService;
        }

        [HttpPost("add/domains")]
        public async Task<IActionResult> AddDomain([FromBody] LookUpDTO domainDTO, CancellationToken ct)
        {
            var res = await _courseMetadataService.CreateDomainAsync(domainDTO, ct);
            return res.Succeded ? CreatedAtAction(nameof(GetDomains), res.Data) : StatusCode(res.StatusCode, res.Error);
        }

        [HttpPost("add/levels")]
        public async Task<IActionResult> AddLevel([FromBody] LookUpDTO levelDTO, CancellationToken ct)
        {
            var res = await _courseMetadataService.CreateLevelAsync(levelDTO, ct);
            return res.Succeded ? CreatedAtAction(nameof(GetLevels), res.Data) : StatusCode(res.StatusCode, res.Error);
        }
        [HttpPost("add/tags")]
        public async Task<IActionResult> AddTag([FromBody] LookUpDTO tagDTO, CancellationToken ct)
        {
            var res = await _courseMetadataService.CreateTagAsync(tagDTO, ct);
            return res.Succeded ? CreatedAtAction(nameof(GetTags), res.Data) : StatusCode(res.StatusCode, res.Error);
        }

        [HttpGet("domains")]
        public async Task<IActionResult> GetDomains(CancellationToken ct)
        {
            var res = await _courseMetadataService.GetAllDomainsAsync(ct);
            return Ok(res.Data);
        }

        [HttpGet("levels")]
        public async Task<IActionResult> GetLevels(CancellationToken ct)
        {
            var res = await _courseMetadataService.GetAllLevelsAsync(ct);
            return Ok(res.Data);
        }

        [HttpGet("tags")]
        public async Task<IActionResult> GetTags(CancellationToken ct)
        {
            var res = await _courseMetadataService.GetAllTagsAsync(ct);
            return Ok(res.Data);
        }
    }
}
