using backend.Shared.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Modules.Tutoring.Models
{
    public class TutoringWallPost: ModelBase
    {
        public required Guid WallId { get; set; }
        public string? Text { get; set; } = null;
        public Guid? HandInId { get; set; } = null;

        public TutoringWall? TutoringWall { get; set; }
        public ICollection<WallPostAttachment>? Attachments { get; set; }

    }
}
