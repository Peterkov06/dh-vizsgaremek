using backend.Shared.Models;

namespace backend.Modules.Identity.Models
{
    public class Qualification: ModelBase
    {
        public required string TeacherId { get; set; }
        public Guid FileId { get; set; }
        public bool Approved { get; set; } = false;
        public required string QualificationType { get; set; }

        public Teacher? Teacher { get; set; }
    }
}
