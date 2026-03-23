using backend.Models;
using backend.Modules.Shared.Models;

namespace backend.Modules.Tutoring.Models
{
    public class WallPostComment: ModelBase
    {
        public required string SenderId { get; set; }
        public Guid WallId { get; set; }
        public Guid PostId { get; set; }
        public string Text { get; set; } = string.Empty;

        public ApplicationUser? Sender { get; set; }
        public TutoringWall? Wall { get; set; }
        public TutoringWallPost? Post { get; set; }
    }
}
