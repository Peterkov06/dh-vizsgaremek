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
        public string TeacherImage { get; set; } = string.Empty;
        public required string TeacherLocation { get; set; }
        public required string CourseName { get; set; }
        public required string Description { get; set; }
        public required CourseType Type { get; set; }
        public required Guid CourseDomainId { get; set; }
        public required Guid CourseLevelId { get; set; }
        public decimal Price { get; set; }
        public required bool FirstConsultationFree { get; set; }
        public CurrencyDTO Currency { get; set; }
        public CourseStatus Status { get; set; }
        public Guid? IconImageId { get; set; } = null;
        public Guid? BannerImageId { get; set; } = null;

        public List<LookUpDTO> Tags { get; set; } = [];
        public List<LookUpDTO> Languages { get; set; } = [];
        public List<CourseReviewDTO> Reviews { get; set; } = [];
    }
}
