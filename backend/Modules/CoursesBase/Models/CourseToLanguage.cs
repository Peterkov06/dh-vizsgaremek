using backend.Shared.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Modules.CoursesBase.Models
{
    public class CourseToLanguage
    {
        [ForeignKey(nameof(Course))]
        public Guid CourseId { get; set; }
        [ForeignKey(nameof(Language))]
        public Guid LanguageId { get; set; }

        public Language? Language { get; set; }
        public CourseBase? Course { get; set; }
    }
}
