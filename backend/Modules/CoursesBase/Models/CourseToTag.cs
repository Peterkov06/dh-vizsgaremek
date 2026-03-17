using backend.Modules.Shared.Models;

namespace backend.Modules.CoursesBase.Models
{
    public class CourseToTag
    {
        public Guid TagId { get; set; }
        public Guid CourseId { get; set; }

        public LookUp? Tag { get; set; }
        public CourseBaseModel? Course { get; set; }
    }
}
