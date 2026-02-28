using backend.Shared.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Modules.LearningPathTemplate.Models
{
    public class UnitLesson: ModelBase
    {
        [ForeignKey(nameof(Unit))]
        public required Guid UnitId { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        [ForeignKey(nameof(HandIn))]
        public Guid HandInId { get; set; }

        public Unit? Unit { get; set; }
        public int HandIn { get; set; } // TODO: Resources Module
    }
}
