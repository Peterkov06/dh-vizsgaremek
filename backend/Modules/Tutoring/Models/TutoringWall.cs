using backend.Models;
using backend.Modules.CoursesBase.Models;
using backend.Shared.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Modules.Tutoring.Models
{
    public class TutoringWall: ModelBase
    {
        [ForeignKey(nameof(Student))]
        public required string StudentId { get; set; }
        [ForeignKey(nameof(CoursesBase))]
        public required Guid CourseId { get; set; }
        public required EnrollmentStatus Status { get; set; }

        public ApplicationUser? Student { get; set; }
        public CourseBaseModel? CourseBase { get; set; }
    }
}
