using backend.Shared.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Modules.Resources.Models
{
    public class Folder: ModelBase
    {
        public required string Name { get; set; }
        [ForeignKey(nameof(ParentFolder))]
        public Guid? ParentFolderId { get; set; }
        public required string OwnerId { get; set; }

        public Folder? ParentFolder { get; set; }
    }
}
