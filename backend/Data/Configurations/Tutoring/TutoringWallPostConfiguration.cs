using backend.Modules.Tutoring.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data.Configurations.Tutoring
{
    public class TutoringWallPostConfiguration : IEntityTypeConfiguration<TutoringWallPost>
    {
        public void Configure(EntityTypeBuilder<TutoringWallPost> builder)
        {
            builder.ToTable("tutoring_wall_posts");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.WallId).IsRequired();
            builder.Property(x => x.Text).IsRequired(false);
            builder.Property(x => x.HandInId).IsRequired(false);

            builder.HasOne(x => x.TutoringWall).WithMany(x => x.WallPosts).HasForeignKey(x => x.WallId).OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(x => x.HandIn).WithOne().HasForeignKey<TutoringWallPost>(x => x.HandInId).OnDelete(DeleteBehavior.Cascade);
        }
    }
}
