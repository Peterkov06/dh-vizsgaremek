using backend.Shared.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Modules.CoursesBase.Models
{
    public class CourseToLanguage
    {
        public Guid CourseId { get; set; }
        public int LanguageId { get; set; }

        public Language? Language { get; set; }
        public CourseBaseModel? Course { get; set; }
    }
}
