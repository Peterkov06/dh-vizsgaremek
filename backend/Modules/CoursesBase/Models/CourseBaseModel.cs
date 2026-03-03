using backend.Models;
using backend.Shared.Models;

namespace backend.Modules.CoursesBase.Models
{
    public class CourseBaseModel: ModelBase
    {
        public required string TeacherId { get; set; }
        public required string CourseName { get; set; }
        public required string Description { get; set; }
        public required CourseType Type { get; set; }
        public required int CourseDomain { get; set; }
        public required int CourseLevelId { get; set; }
        public decimal Price { get; set; }
        public required bool FirstConsultationFree { get; set; }
        public Guid PriceCurrencyId { get; set; }
        public CourseStatus Status { get; set; }
        public ApplicationUser? Teacher { get; set; }

    }
}
