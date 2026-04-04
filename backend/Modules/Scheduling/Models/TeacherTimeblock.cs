using backend.Modules.Identity.Models;
using backend.Modules.Shared.Models;

namespace backend.Modules.Scheduling.Models
{
    public class TeacherTimeblock: ModelBase
    {
        public required string TeacherId { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }

        public Teacher? Teacher { get; set; }
    }
}
