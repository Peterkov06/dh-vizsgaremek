using backend.Models;
using backend.Modules.CoursesBase.Models;
using backend.Shared.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Modules.Tutoring.Models
{
    public class TutoringWall: ModelBase
    {
        public required string StudentId { get; set; }
        public required Guid CourseId { get; set; }
        public required EnrollmentStatus Status { get; set; }
        public int TokenCount { get; set; }

        public ApplicationUser? Student { get; set; }
        public CourseBaseModel? CourseBase { get; set; } = null;
        public ICollection<TutoringWallPost>? WallPosts { get; set; }
    }
}
