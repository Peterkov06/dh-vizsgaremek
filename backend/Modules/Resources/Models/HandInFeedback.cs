using backend.Modules.Identity.Models;
using backend.Shared.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Modules.Resources.Models
{
    public class HandInFeedback: ModelBase
    {
        public string? Text { get; set; } = null;
        public int? Grade { get; set; } = null;
        public int? Points { get; set; } = null;
        public required Guid SubmissionId { get; set; }
        public required Guid GraderId { get; set; }

        public Submission? Submission { get; set; }
        public Teacher? Teacher { get; set; }
    }
}
