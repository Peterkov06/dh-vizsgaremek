using backend.Modules.Resources.Models;
using backend.Modules.Shared.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Modules.LearningPathTemplate.Models
{
    public class UnitLesson: ModelBase
    {
        public required Guid UnitId { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public Guid? HandInId { get; set; }

        public Unit? Unit { get; set; }
        public HandIn? HandIn { get; set; }
        public ICollection<LessonToContent> Contents { get; set; } = [];
    }
}
