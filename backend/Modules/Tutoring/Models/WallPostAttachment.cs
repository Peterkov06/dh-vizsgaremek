using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Modules.Tutoring.Models
{
    public class WallPostAttachment
    {
        [ForeignKey(nameof(WallPost))]
        public required Guid WallPostId { get; set; }
        [ForeignKey(nameof(Content))]
        public required Guid ContentId { get; set; }

        public TutoringWallPost? WallPost { get; set; }
        public int Content { get; set; } // TODO: Resources model
    }
}
