using backend.Modules.Identity.Models;
using backend.Modules.Progression.Models;
using backend.Modules.Shared.Models;
using backend.Modules.Tutoring.Models;

namespace backend.Modules.Engagement.Models
{
    public class ChatRoom: ModelBase
    {
        public string StudentId { get; set; } = string.Empty;
        public string TeacherId { get; set; } = string.Empty;

        public Student? Student { get; set; }
        public Teacher? Teacher { get; set; }

        public ICollection<ChatMessage> Messages { get; set; } = [];
    }
}
