using backend.Modules.Shared.DTOs;
using backend.Modules.Shared.Results;

namespace backend.Modules.Shared.Services
{
    public interface ILookUpService
    {
        Task<ServiceResult<List<LookUpDTO>>> GetLanguages();
        Task<ServiceResult<List<CurrencyDTO>>> GetCurrencies();

        Task<ServiceResult> AddLanguage(LookUpDTO language);
        Task<ServiceResult> AddCurrency(CurrencyDTO currency);
    }
}
