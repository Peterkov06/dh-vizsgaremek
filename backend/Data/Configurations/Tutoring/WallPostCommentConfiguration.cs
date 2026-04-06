using backend.Modules.Tutoring.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data.Configurations.Tutoring
{
    public class WallPostCommentConfiguration: ModelBaseConfiguration<WallPostComment>
    {
        public override void Configure(EntityTypeBuilder<WallPostComment> builder)
        {
            base.Configure(builder);
            builder.ToTable("wall_post_comments");
            builder.Property(x => x.SenderId).IsRequired();
            
            builder.HasOne(x => x.Sender).WithMany().HasForeignKey(x => x.SenderId).IsRequired().OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(x => x.Post).WithMany(x => x.Comments).HasForeignKey(x => x.PostId).IsRequired().OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(x => x.Wall).WithMany().HasForeignKey(x => x.WallId).IsRequired().OnDelete(DeleteBehavior.Cascade);
        }
    }
}
