using backend.Modules.CoursesBase.Models;

namespace backend.Shared.Models
{
    public class Language
    {
        public required int Id { get; set; }
        public required string Name { get; set; }

        public ICollection<CourseToLanguage>? CoursesToLanguage { get; set; }
    }
}
