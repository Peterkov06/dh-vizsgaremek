using backend.Modules.Engagement.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data.Configurations.Engagement
{
    public class CommunityMessageConfiguration: ModelBaseConfiguration<CommunityMessage>
    {
        public override void Configure(EntityTypeBuilder<CommunityMessage> builder)
        {
            base.Configure(builder);
            builder.ToTable("community_messages");
            builder.Property(x => x.SenderId).IsRequired();
            builder.Property(x => x.Text).IsRequired();

            builder.HasOne(x => x.Thread).WithMany(x => x.Messages).HasForeignKey(x => x.ThreadId).IsRequired().OnDelete(DeleteBehavior.Cascade);
        }
    }
}
