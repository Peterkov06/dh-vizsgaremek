using backend.Shared.Models;

namespace backend.Modules.Identity.Models
{
    public class Qualification: ModelBase
    {
        public required string UserId { get; set; }
        public Guid FieldId { get; set; }
        public bool Approved { get; set; } = false;
        public required string QualificationType { get; set; }
    }
}
