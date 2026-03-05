using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Modules.CoursesBase.Models
{
    public class CourseToTag
    {
        public Guid TagId { get; set; }
        public Guid CourseId { get; set; }

        public CourseTag? Tag { get; set; }
        public CourseBaseModel? Course { get; set; }
    }
}
