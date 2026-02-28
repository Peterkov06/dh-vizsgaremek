using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Modules.CoursesBase.Models
{
    public class CourseToTag
    {
        [ForeignKey(nameof(Tag))]
        public Guid TagId { get; set; }
        [ForeignKey(nameof(Course))]
        public Guid CourseId { get; set; }

        public CourseTag? Tag { get; set; }
        public CourseBaseModel? Course { get; set; }
    }
}
