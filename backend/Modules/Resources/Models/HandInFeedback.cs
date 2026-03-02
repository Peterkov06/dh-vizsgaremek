using backend.Shared.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Modules.Resources.Models
{
    public class HandInFeedback: ModelBase
    {
        public string? Text { get; set; } = null;
        public int? Grade { get; set; } = null;
        public int? Points { get; set; } = null;
        [ForeignKey(nameof(Submission))]
        public required Guid SubmissionId { get; set; }

        public Submission? Submission { get; set; }
    }
}
