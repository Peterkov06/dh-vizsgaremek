using backend.Modules.Shared.DTOs;
using backend.Modules.Shared.Results;

namespace backend.Modules.Shared.Services
{
    public interface ILookUpService
    {
        Task<ServiceResult<List<LookUpDTO>>> GetLanguagesAsync(CancellationToken ct);
        Task<ServiceResult<List<Guid>>> GetLanguagesFromList(List<string> languages, CancellationToken ct);
        Task<ServiceResult<List<CurrencyDTO>>> GetCurrenciesAsync(CancellationToken ct);

        Task<ServiceResult<LookUpDTO>> AddLanguageAsync(LookUpDTO language, CancellationToken ct);
        Task<ServiceResult<CurrencyDTO>> AddCurrencyAsync(CurrencyDTO currency, CancellationToken ct);

        Task<ServiceResult<List<int>>> GetCititesFromList(List<string> cities, CancellationToken ct);
    }
}
