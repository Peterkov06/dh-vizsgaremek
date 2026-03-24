using backend.Modules.CoursesBase.Models;
using backend.Modules.Shared.DTOs;

namespace backend.Modules.CoursesBase.DTOs
{
    public class CourseBaseExplorerDTO
    {
        public Guid? Id { get; set; } = null;
        public required string TeacherId { get; set; }
        public required string TeacherName { get; set; }
        public string TeacherImage { get; set; } = string.Empty;
        public required string TeacherLocation { get; set; }
        public required string CourseName { get; set; }
        public required CourseType Type { get; set; }
        public required LookUpDTO CourseDomain { get; set; }
        public required LookUpDTO CourseLevel { get; set; }
        public decimal Price { get; set; }
        public required bool FirstConsultationFree { get; set; }
        public CurrencyDTO? Currency { get; set; } = null;
        public string IconImage { get; set; } = string.Empty;
        public string BannerImage { get; set; } = string.Empty;

        public List<LookUpDTO> Tags { get; set; } = [];
        public List<LookUpDTO> Languages { get; set; } = [];
    }
}
