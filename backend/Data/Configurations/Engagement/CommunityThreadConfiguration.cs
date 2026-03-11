using backend.Modules.Engagement.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data.Configurations.Engagement
{
    public class CommunityThreadConfiguration: ModelBaseConfiguration<CommunityThread>
    {
        public override void Configure(EntityTypeBuilder<CommunityThread> builder)
        {
            base.Configure(builder);
            builder.ToTable("community_threads");

            builder.HasOne(x => x.Course).WithOne().HasForeignKey<CommunityThread>(x => x.CourseId).IsRequired(false).OnDelete(DeleteBehavior.Cascade);
        }
    }
}
