using backend.Models;
using backend.Modules.Progression.Models;
using backend.Modules.Tutoring.Models;
using backend.Shared.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Modules.Payment.Models
{
    public class Invoice: ModelBase
    {
        public required int TokenCount { get; set; }
        public Guid? WallId { get; set; } = null;
        public Guid? EnrollmentId { get; set; } = null;
        public PaymentStatus Status { get; set; }
        public decimal PaidPrice { get; set; }
        public required Guid CurrencyId { get; set; }
        public required string UserId { get; set; }

        public TutoringWall? Wall { get; set; }
        public PathEnrollment? Enrollment { get; set; }
        public Currency? Currency { get; set; }
        public ApplicationUser? User { get; set; }
    }
}
