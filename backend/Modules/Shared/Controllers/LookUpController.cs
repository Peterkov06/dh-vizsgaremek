using backend.Modules.Shared.DTOs;
using backend.Modules.Shared.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Modules.Shared.Controllers
{
    [ApiController]
    [Route("api/lookups")]
    public class LookUpController: ControllerBase
    {
        private readonly ILookUpService _lookUpService;

        public LookUpController(ILookUpService lookUpService)
        {
            _lookUpService = lookUpService;
        }

        [HttpPost("currencies/add")]
        public async Task<IActionResult> AddCurrency([FromBody] CurrencyDTO currencyDTO, CancellationToken ct)
        {
            var res = await _lookUpService.AddCurrencyAsync(currencyDTO, ct);
            return res.Succeded ? CreatedAtAction(nameof(GetCurrencies), res.Data) : StatusCode(res.StatusCode, res.Error);
        }

        [HttpPost("languages/add")]
        public async Task<IActionResult> AddLanguage([FromBody] LookUpDTO lookUpDTO, CancellationToken ct)
        {
            var res = await _lookUpService.AddLanguageAsync(lookUpDTO, ct);
            return res.Succeded ? CreatedAtAction(nameof(GetLanguages), res.Data) : StatusCode(res.StatusCode, res.Error);
        }

        [HttpGet("currencies")]
        public async Task<IActionResult> GetCurrencies(CancellationToken ct)
        {
            var res = await _lookUpService.GetCurrenciesAsync(ct);
            return Ok(res.Data);
        }

        [HttpGet("languages")]
        public async Task<IActionResult> GetLanguages(CancellationToken ct)
        {
            var res = await _lookUpService.GetLanguagesAsync(ct);
            return Ok(res.Data);
        }
    }
}
