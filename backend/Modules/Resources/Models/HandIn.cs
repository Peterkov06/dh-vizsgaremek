using backend.Shared.Models;

namespace backend.Modules.Resources.Models
{
    public class HandIn: ModelBase
    {
        public DateTime? DueDate { get; set; } = null;
        public required HandInType Type { get; set; }
        public int? MaxPoints { get; set; }

        public ICollection<Submission>? Submissions { get; set; }
    }
}
