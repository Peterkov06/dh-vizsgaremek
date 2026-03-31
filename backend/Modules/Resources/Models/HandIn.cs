using backend.Modules.Shared.Models;
using backend.Modules.Tutoring.Models;

namespace backend.Modules.Resources.Models
{
    public class HandIn: ModelBase
    {
        public string Title { get; set; } = string.Empty;
        public DateTime? DueDate { get; set; } = null;
        public required HandInType Type { get; set; }
        public int? MaxPoints { get; set; }
        public Guid WallId { get; set; }

        public TutoringWall? Wall { get; set; }
        public ICollection<Submission> Submissions { get; set; } = [];
    }
}
