using backend.Modules.Resources.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data.Configurations.Resources
{
    public class FolderConfiguration: ModelBaseConfiguration<Folder>
    {
        public override void Configure(EntityTypeBuilder<Folder> builder)
        {
            base.Configure(builder);
            builder.Property(x => x.Name).IsRequired().HasMaxLength(200);
            builder.Property(x => x.OwnerId).IsRequired().HasMaxLength(450);
            
            builder.HasOne(x => x.ParentFolder).WithMany().HasForeignKey(x => x.ParentFolderId).OnDelete(DeleteBehavior.Cascade);
        }
    }
}
