using backend.Shared.Models;

namespace backend.Modules.CoursesBase.Models
{
    public class CourseLevel: ModelBase
    {
        public required string Name { get; set; }
        public ICollection<CourseBaseModel>? Courses { get; set; }
    }
}
