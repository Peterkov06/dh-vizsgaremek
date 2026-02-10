using backend.Data;
using backend.Models.Cities;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers.Cities
{
    [Route("api/cities")]
    [ApiController]
    public class CitiesController : ControllerBase
    {

        private readonly UserDbContext _context;

        public CitiesController(UserDbContext context)
        {
            _context = context;
        }

        [HttpGet("all")]
        public async Task<IActionResult> AllCity() {

            var cities = _context.Cities.Select(c=>c.CityName).Distinct().ToList();

            if (cities == null) {
                return BadRequest();
            }

            return Ok(cities);
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchCity([FromQuery]string city) {

            if (string.IsNullOrEmpty(city))
                return BadRequest();

            var cities = _context.Cities.Where(c => c.CityName.ToLower().StartsWith(city.ToLower())).Select(c => c.CityName).Distinct().ToList();

            return Ok(cities);
        }

        [HttpGet("postal/search")]
        public async Task<IActionResult> SearchPostal([FromQuery]string postal)
        {
            if (string.IsNullOrEmpty(postal))
                return BadRequest();

            var cities = _context.Cities.Where(c => c.PostalCode.ToLower().StartsWith(postal.ToLower())).Select(c => c.CityName).Distinct().ToList();

            return Ok(cities);
        }

        [HttpGet("search/city/postal")]
        public async Task<IActionResult> SearchPostalFromCity([FromQuery]string city)
        {

            if (string.IsNullOrEmpty(city))
                return BadRequest();

            var cities = _context.Cities.Where(c => c.CityName.ToLower().StartsWith(city.ToLower())).Select(c => c.PostalCode).Distinct().ToList();

            return Ok(cities);
        }
    }
}
