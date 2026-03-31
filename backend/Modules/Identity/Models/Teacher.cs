using backend.Models;
using backend.Modules.CoursesBase.Models;
using backend.Modules.Engagement.Models;

namespace backend.Modules.Identity.Models
{
    public class Teacher
    {
        public required string TeacherId { get; set; }

        public ApplicationUser? User { get; set; }

        public ICollection<ChatRoom> Chats { get; set; } = [];
        public ICollection<CourseBaseModel> Courses { get; set; } = [];
    }
}
