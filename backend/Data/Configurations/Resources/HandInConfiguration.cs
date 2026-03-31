using backend.Modules.Resources.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data.Configurations.Resources
{
    public class HandInConfiguration: ModelBaseConfiguration<HandIn>
    {
        public override void Configure(EntityTypeBuilder<HandIn> builder)
        {
            base.Configure(builder);
            builder.ToTable("hand_ins");
            builder.Property(x => x.DueDate).IsRequired(false);
            builder.Property(x => x.Type).IsRequired().HasConversion<string>().HasMaxLength(50);
            builder.Property(x => x.MaxPoints).IsRequired(false);
            builder.Property(x => x.Title).IsRequired();

            builder.HasOne(x => x.Wall).WithMany().HasForeignKey(x => x.WallId).IsRequired().OnDelete(DeleteBehavior.Cascade);
        }
    }
}
