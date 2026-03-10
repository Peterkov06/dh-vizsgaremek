using backend.Modules.Progression.Models;
using backend.Modules.Tutoring.Models;
using backend.Shared.Models;

namespace backend.Modules.Engagement.Models
{
    public class ChatRoom: ModelBase
    {
        public Guid? WallId { get; set; }
        public Guid? EnrollmentId { get; set; }

        public TutoringWall? Wall { get; set; }
        public PathEnrollment? Enrollment { get; set; }
        public ICollection<ChatMessage> Messages { get; set; } = [];
    }
}
