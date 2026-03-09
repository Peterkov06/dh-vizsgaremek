using backend.Modules.Tutoring.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data.Configurations.Tutoring
{
    public class TutoringWallAttachmentConfiguration : IEntityTypeConfiguration<WallPostAttachment>
    {
        public void Configure(EntityTypeBuilder<WallPostAttachment> builder)
        {
            builder.ToTable("tutoring_wall_post_attachments");
            builder.HasKey(x => new { x.WallPostId, x.ContentId });

            builder.HasOne(x => x.WallPost).WithMany(x => x.Attachments).HasForeignKey(x => x.WallPostId).OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(x => x.Content).WithMany().HasForeignKey(x => x.ContentId).OnDelete(DeleteBehavior.Cascade);
        }
    }
}
