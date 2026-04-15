using backend.Modules.CoursesBase.Models;
using backend.Modules.Engagement.DTOs;
using backend.Modules.Shared.DTOs;

namespace backend.Modules.CoursesBase.DTOs
{
    public class CourseBaseDTO
    {
        public Guid? Id { get; set; } = null;
        public required string TeacherId { get; set; }
        public required string TeacherName { get; set; }
        public string? TeacherImage { get; set; } = null;
        public required string CourseName { get; set; }
        public required string Description { get; set; }
        public required CourseType Type { get; set; }
        public required LookUpDTO CourseDomain { get; set; }
        public required LookUpDTO CourseLevel { get; set; }
        public decimal Price { get; set; }
        public required bool FirstConsultationFree { get; set; }
        public CurrencyDTO Currency { get; set; }
        public string? IconImage { get; set; } = null;
        public string? BannerImage { get; set; } = null;
        public float RatingAverage { get; set; } = 0f;
        public string TeacherIntroduction { get; set; } = string.Empty;
        public int ClassLenght { get; set; } = 0;

        public List<LookUpDTO> Tags { get; set; } = [];
        public List<LookUpDTO> Languages { get; set; } = [];
        public List<LookUpDTO> Locations { get; set; } = [];
        public List<CourseReviewDTO> Reviews { get; set; } = [];
    }
}
