using backend.Modules.Tutoring.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data.Configurations.Tutoring
{
    public class TutoringWallConfiguration : IEntityTypeConfiguration<TutoringWall>
    {
        public void Configure(EntityTypeBuilder<TutoringWall> builder)
        {
            builder.ToTable("tutoring_walls");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.StudentId).IsRequired().HasMaxLength(450);
            builder.Property(x => x.CourseId).IsRequired();
            builder.Property(x => x.Status).IsRequired().HasConversion<string>().HasMaxLength(50);
            builder.Property(x => x.TokenCount).IsRequired();
            
            builder.HasOne(x => x.Student).WithMany(x => x.TutoringWalls).HasForeignKey(x => x.StudentId).OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(x => x.CourseBase).WithMany().HasForeignKey(x => x.CourseId).OnDelete(DeleteBehavior.Cascade);
        }
    }
}
