using backend.Modules.Tutoring.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data.Configurations.Tutoring
{
    public class TutoringWallConfiguration : ModelBaseConfiguration<TutoringWall>
    {
        public override void Configure(EntityTypeBuilder<TutoringWall> builder)
        {
            base.Configure(builder);
            builder.ToTable("tutoring_walls");
            builder.Property(x => x.StudentId).IsRequired();
            builder.Property(x => x.CourseId).IsRequired();
            builder.Property(x => x.Status).IsRequired().HasConversion<string>().HasMaxLength(50);
            builder.Property(x => x.TokenCount).IsRequired();

            builder.HasOne(x => x.Student).WithMany(x => x.TutoringWalls).HasForeignKey(x => x.StudentId).IsRequired().OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(x => x.CourseBase).WithMany().HasForeignKey(x => x.CourseId).IsRequired().OnDelete(DeleteBehavior.Restrict);
            builder.HasOne(x => x.Teacher).WithMany().HasForeignKey(x => x.TeacherId).IsRequired().OnDelete(DeleteBehavior.Cascade);
        }
    }
}
