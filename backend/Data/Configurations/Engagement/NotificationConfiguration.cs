using backend.Modules.Engagement.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data.Configurations.Engagement
{
    public class NotificationConfiguration: ModelBaseConfiguration<Notification>
    {
        public override void Configure(EntityTypeBuilder<Notification> builder)
        {
            base.Configure(builder);
            builder.ToTable("notifications");
            builder.Property(x => x.Type).IsRequired().HasConversion<string>().HasMaxLength(50);
            builder.Property(x => x.RecipientId).IsRequired().HasMaxLength(450);
            builder.Property(x => x.Title).IsRequired().HasMaxLength(100);
            builder.Property(x => x.Message).IsRequired().HasMaxLength(500);
            builder.Property(x => x.ReferenceId).IsRequired();
            builder.Property(x => x.IsRead).IsRequired();
            builder.Property(x => x.ReadAt).IsRequired(false);

            builder.HasOne(x => x.User).WithMany().HasForeignKey(x => x.RecipientId).IsRequired().OnDelete(DeleteBehavior.Cascade);
        }
    }
}
