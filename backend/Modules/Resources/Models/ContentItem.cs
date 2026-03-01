using backend.Shared.Models;

namespace backend.Modules.Resources.Models
{
    public class ContentItem: ModelBase
    {
        public required string DisplayedName { get; set; }
        public Guid FolderId { get; set; }
        public ContentType Type { get; set; }
        public string? Description { get; set; } = null;
        public Guid? FileId { get; set; } = null;
        public Guid? TestId { get; set; } = null;

    }
}
