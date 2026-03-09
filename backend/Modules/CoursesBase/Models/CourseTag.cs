using backend.Shared.Models;

namespace backend.Modules.CoursesBase.Models
{
    public class CourseTag: ModelBase
    {
        public required string Name { get; set; }

        public ICollection<CourseToTag>? CoursesToTag { get; set; }
    }
}
