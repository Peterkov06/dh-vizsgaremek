using backend.Modules.CoursesBase.Models;
using backend.Modules.Identity.Models;
using backend.Modules.Shared.Models;

namespace backend.Modules.Engagement.Models
{
    public class CommunityThread: ModelBase
    {
        public Guid CourseId { get; set; }
        public required string TeacherId { get; set; }

        public CourseBaseModel? Course { get; set; }
        public Teacher? Teacher { get; set; }
        public ICollection<CommunityMessage> Messages { get; set; } = [];
    }
}
