using backend.Shared.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Modules.Resources.Models
{
    public class SubmissionAttachment: ModelBase
    {
        [ForeignKey(nameof(Submission))]
        public required Guid SubmissionId { get; set; }
        [ForeignKey(nameof(Content))]
        public required Guid ContentId { get; set; }
        public Submission? Submission { get; set; }
        public ContentItem? Content { get; set; }
    }
}
