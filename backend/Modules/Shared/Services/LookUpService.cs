using backend.Data;
using backend.Modules.Shared.DTOs;
using backend.Modules.Shared.Models;
using backend.Modules.Shared.Results;
using Microsoft.EntityFrameworkCore;

namespace backend.Modules.Shared.Services
{
    public class LookUpService : ILookUpService
    {
        private readonly AppDbContext _db;

        public LookUpService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<ServiceResult> AddCurrency(CurrencyDTO currency)
        {
            var exists = await _db.Currencies.AnyAsync(x => x.CurrencyCode == currency.CurrencyCode);
            if (exists) {
                return ServiceResult.Failure("Currency already exists");
            }

            Currency newCurrency = new Currency() { CurrencyCode = currency.CurrencyCode, CurrencySymbol = currency.CurrencySymbol, Name = currency.Name };
            _db.Currencies.Add(newCurrency);
            await _db.SaveChangesAsync();
            return ServiceResult.Success();
        }

        public async Task<ServiceResult> AddLanguage(LookUpDTO language)
        {
            var exists = await _db.Languages.AnyAsync(x => x.Name == language.Name);
            if (exists)
            {
                return ServiceResult.Failure("Language already exists");
            }

            LookUp newLanguage = new LookUp() { Name = language.Name };
            _db.Languages.Add(newLanguage);
            await _db.SaveChangesAsync();
            return ServiceResult.Success();
        }

        public async Task<ServiceResult<List<CurrencyDTO>>> GetCurrencies()
        {
            var currencies = await _db.Currencies.OrderBy(x => x.Name).Select(x => new CurrencyDTO { Name = x.Name, CurrencyCode = x.CurrencyCode, CurrencySymbol = x.CurrencySymbol }).ToListAsync();
            return ServiceResult<List<CurrencyDTO>>.Success(currencies);
        }

        public async Task<ServiceResult<List<LookUpDTO>>> GetLanguages()
        {
            var languages = await _db.Languages.OrderBy(x => x.Name).Select(x => new LookUpDTO { Name = x.Name, Id = x.Id }).ToListAsync();
            return ServiceResult<List<LookUpDTO>>.Success(languages);
        }
    }
}
