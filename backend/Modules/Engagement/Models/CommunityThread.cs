using backend.Modules.CoursesBase.Models;
using backend.Shared.Models;

namespace backend.Modules.Engagement.Models
{
    public class CommunityThread: ModelBase
    {
        public Guid CourseId { get; set; }

        public CourseBaseModel? Course { get; set; }
        public ICollection<CommunityMessage>? Messages { get; set; }
    }
}
