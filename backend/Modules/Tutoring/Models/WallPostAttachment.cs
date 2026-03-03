using backend.Modules.Resources.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Modules.Tutoring.Models
{
    public class WallPostAttachment
    {
        public required Guid WallPostId { get; set; }
        public required Guid ContentId { get; set; }

        public TutoringWallPost? WallPost { get; set; }
        public ContentItem? Content { get; set; } 
    }
}
