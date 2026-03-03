using backend.Models;
using backend.Shared.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Modules.Resources.Models
{
    public class Submission: ModelBase
    {
        public string? Text { get; set; } = null;
        public required Guid HandInId { get; set; }
        public required string SubmitterId { get; set; }
        public HandIn? HandIn { get; set; }
        public ApplicationUser? Submitter { get; set; }
    }
}
