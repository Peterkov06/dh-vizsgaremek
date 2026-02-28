using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Modules.LearningPathTemplate.Models
{
    public class LessonToContent
    {
        [ForeignKey(nameof(Lesson))]
        public Guid LessonId { get; set; }
        [ForeignKey(nameof(Content))]
        public Guid ContentId { get; set; }
        public UnitLesson? Lesson { get; set; }
        public int Content { get; set; } // TODO: Resources model
    }
}
