using backend.Modules.Progression.Models;
using backend.Modules.Tutoring.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Modules.Payment.Models
{
    public class TokenWallet
    {
        public int TokenCount { get; set; }
        [ForeignKey(nameof(Wall))]
        public Guid? WallId { get; set; } = null;
        [ForeignKey(nameof(Enrollment))]
        public Guid? EnrollmentId { get; set; } = null;

        public TutoringWall? Wall { get; set; }
        public PathEnrollment? Enrollment { get; set; }
    }
}
