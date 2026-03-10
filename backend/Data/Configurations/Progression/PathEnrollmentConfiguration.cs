using backend.Modules.Progression.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data.Configurations.Progression
{
    public class PathEnrollmentConfiguration: ModelBaseConfiguration<PathEnrollment>
    {
        public override void Configure(EntityTypeBuilder<PathEnrollment> builder)
        {
            base.Configure(builder);
            builder.ToTable("path_enrollments");
            builder.Property(x => x.CourseId).IsRequired();
            builder.Property(x => x.AttendantId).IsRequired();
            builder.Property(x => x.LastLessonId).IsRequired(false);
            builder.Property(x => x.Status).IsRequired().HasConversion<string>().HasMaxLength(50);
            builder.Property(x => x.TokenCount).IsRequired();

            builder.HasOne(x => x.Course).WithMany().HasForeignKey(x => x.CourseId).OnDelete(DeleteBehavior.Restrict);
            builder.HasOne(x => x.Attendant).WithMany(x => x.LearningPathEnrollments).HasForeignKey(x => x.AttendantId).OnDelete(DeleteBehavior.Restrict);
        }
    }
}
