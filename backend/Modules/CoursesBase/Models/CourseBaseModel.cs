using backend.Models;
using backend.Modules.Engagement.Models;
using backend.Modules.Identity.Models;
using backend.Shared.Models;

namespace backend.Modules.CoursesBase.Models
{
    public class CourseBaseModel: ModelBase
    {
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

        public Teacher? Teacher { get; set; }
        public CourseDomain? CourseDomain { get; set; }
        public CourseLevel? CourseLevel { get; set; }
        public Currency? Currency { get; set; }

        public ICollection<CourseToTag> CourseToTags { get; set; } = [];
        public ICollection<CourseToLanguage> CourseToLanguages { get; set; } = [];
        public ICollection<CourseReview> Reviews { get; set; } = [];

    }
}
