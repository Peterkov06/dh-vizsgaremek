using backend.Modules.Identity.Models;
using backend.Modules.Shared.Models;

namespace backend.Modules.Resources.Models
{
    public class Submission: ModelBase
    {
        public string? Text { get; set; } = null;
        public required Guid HandInId { get; set; }
        public required string SubmitterId { get; set; }
        public HandIn? HandIn { get; set; }
        public Student? Submitter { get; set; }
        public ICollection<SubmissionAttachment> Attachments { get; set; } = [];
        public HandInFeedback? Feedback { get; set; }
    }
}
