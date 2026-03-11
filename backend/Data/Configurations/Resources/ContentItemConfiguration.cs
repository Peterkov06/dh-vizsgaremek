using backend.Modules.Resources.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data.Configurations.Resources
{
    public class ContentItemConfiguration: ModelBaseConfiguration<ContentItem>
    {
        public override void Configure(EntityTypeBuilder<ContentItem> builder)
        {
            base.Configure(builder);
            builder.ToTable("content_items", x =>
            {
                x.HasCheckConstraint("CK_ContentItem_SingleContext", @"((""FileId"" IS NOT NULL)::int + (""TestId"" IS NOT NULL)::int) = 1");
            });
            builder.Property(x => x.DisplayedName).IsRequired().HasMaxLength(255);
            builder.Property(x => x.Type).IsRequired().HasConversion<string>().HasMaxLength(50);
            builder.Property(x => x.Description).IsRequired(false);

            builder.HasOne(x => x.File).WithMany().HasForeignKey(x => x.FileId).OnDelete(DeleteBehavior.SetNull).IsRequired(false);
            builder.HasOne(x => x.Test).WithMany().HasForeignKey(x => x.TestId).OnDelete(DeleteBehavior.SetNull).IsRequired(false);
        }
    }
}
