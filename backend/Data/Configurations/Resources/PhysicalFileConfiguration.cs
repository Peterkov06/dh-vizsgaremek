using backend.Modules.Resources.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data.Configurations.Resources
{
    public class PhysicalFileConfiguration: ModelBaseConfiguration<PhysicalFile>
    {
        public override void Configure(EntityTypeBuilder<PhysicalFile> builder)
        {
            base.Configure(builder);
            builder.ToTable("physical_files");
            builder.Property(x => x.StoragePath).IsRequired();
            builder.Property(x => x.FileName).IsRequired();
            builder.Property(x => x.MimeType).IsRequired().HasMaxLength(100);
            builder.Property(x => x.Size).IsRequired();

            builder.HasOne(x => x.Owner).WithMany().HasForeignKey(x => x.OwnerId).IsRequired().OnDelete(DeleteBehavior.Cascade);
        }
    }
}
