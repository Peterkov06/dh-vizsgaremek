using backend.Modules.Shared.Models;

namespace backend.Modules.CoursesBase.Models
{
    public class CourseToLanguage
    {
        public Guid CourseId { get; set; }
        public Guid LanguageId { get; set; }

        public LookUp? Language { get; set; }
        public CourseBaseModel? Course { get; set; }
    }
}
