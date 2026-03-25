using backend.Modules.Shared.DTOs;

namespace backend.Modules.Pages.Teacher.DTOs
{
    public class CourseBaseCreationPageDTO
    {
        public List<CurrencyDTO> Currencies { get; set; } = [];
        public List<LookUpDTO> Languages { get; set; } = [];
        public List<LookUpDTO> Domains { get; set; } = [];
        public List<LookUpDTO> Levels { get; set; } = [];
    }
}
