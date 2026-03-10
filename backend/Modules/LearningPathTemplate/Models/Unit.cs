using backend.Modules.CoursesBase.Models;
using backend.Shared.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Modules.LearningPathTemplate.Models
{
    public class Unit: ModelBase
    {
        public required Guid CourseId { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
        public CourseBaseModel? Course { get; set; }
        public ICollection<UnitLesson> Lessons { get; set; } = [];
    }
}
