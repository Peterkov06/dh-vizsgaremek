using backend.Modules.CoursesBase.Models;

namespace backend.Modules.CoursesBase.DTOs
{
    public class CourseBaseCreationDTO
    {
        public Guid? Id { get; set; } = null;
        public required string TeacherId { get; set; }
        public required string CourseName { get; set; }
        public required string Description { get; set; }
        public required CourseType Type { get; set; }
        public required Guid CourseDomainId { get; set; }
        public required Guid CourseLevelId { get; set; }
        public decimal Price { get; set; }
        public required bool FirstConsultationFree { get; set; }
        public Guid PriceCurrencyId { get; set; }
        public CourseStatus Status { get; set; }
        public Guid? IconImageId { get; set; } = null;
        public Guid? BannerImageId { get; set; } = null;
        public List<string> Tags { get; set; } = [];
        public List<string> Languages { get; set; } = [];
    }
}
