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

        public async Task<ServiceResult<CurrencyDTO>> AddCurrencyAsync(CurrencyDTO currency, CancellationToken ct = default)
        {
            var exists = await _db.Currencies.AnyAsync(x => x.CurrencyCode == currency.CurrencyCode);
            if (exists) {
                return ServiceResult<CurrencyDTO>.Failure("Currency already exists");
            }

            Currency newCurrency = new() { CurrencyCode = currency.CurrencyCode, CurrencySymbol = currency.CurrencySymbol, Name = currency.Name };
            _db.Currencies.Add(newCurrency);
            await _db.SaveChangesAsync(ct);
            return ServiceResult<CurrencyDTO>.Success( new CurrencyDTO { Id = newCurrency.Id, Name = newCurrency.Name, CurrencyCode = newCurrency.CurrencyCode, CurrencySymbol = newCurrency.CurrencySymbol });
        }

        public async Task<ServiceResult<LookUpDTO>> AddLanguageAsync(LookUpDTO language, CancellationToken ct = default)
        {
            var exists = await _db.Languages.AnyAsync(x => x.Name == language.Name, ct);
            if (exists)
            {
                return ServiceResult<LookUpDTO>.Failure("Language already exists");
            }

            Language newLanguage = new () { Name = language.Name };
            _db.Languages.Add(newLanguage);
            await _db.SaveChangesAsync(ct);
            return ServiceResult<LookUpDTO>.Success(new LookUpDTO { Id = newLanguage.Id, Name = newLanguage.Name });
        }

        public async Task<ServiceResult<List<CurrencyDTO>>> GetCurrenciesAsync(CancellationToken ct = default)
        {
            var currencies = await _db.Currencies.OrderBy(x => x.Name).Select(x => new CurrencyDTO { Name = x.Name, CurrencyCode = x.CurrencyCode, CurrencySymbol = x.CurrencySymbol, Id = x.Id }).ToListAsync(ct);
            return ServiceResult<List<CurrencyDTO>>.Success(currencies);
        }

        public async Task<ServiceResult<List<LookUpDTO>>> GetLanguagesAsync(CancellationToken ct = default)
        {
            var languages = await _db.Languages.OrderBy(x => x.Name).Select(x => new LookUpDTO { Name = x.Name, Id = x.Id }).ToListAsync(ct);
            return ServiceResult<List<LookUpDTO>>.Success(languages);
        }

        public async Task<ServiceResult<List<Guid>>> GetLanguagesFromList(List<string> languages, CancellationToken ct = default)
        {
            var languageIds = await _db.Languages.Where(x => languages.Contains(x.Name)).Select(x => x.Id).ToListAsync(ct);
            return ServiceResult<List<Guid>>.Success(languageIds);
        }

        public async Task<ServiceResult<List<int>>> GetCititesFromList(List<string> cities, CancellationToken ct = default)
        {
            var citIDs = await _db.Cities.Where(x => cities.Contains(x.CityName)).Select(x => x.Id).ToListAsync(ct);
            
            return ServiceResult<List<int>>.Success(citIDs);
        }
    }
}
