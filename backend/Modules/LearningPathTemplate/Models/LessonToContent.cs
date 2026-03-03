using backend.Modules.Resources.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Modules.LearningPathTemplate.Models
{
    public class LessonToContent
    {
        public Guid LessonId { get; set; }
        public Guid ContentId { get; set; }
        public UnitLesson? Lesson { get; set; }
        public ContentItem? Content { get; set; } 
    }
}
