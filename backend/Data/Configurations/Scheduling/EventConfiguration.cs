using backend.Modules.Scheduling.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data.Configurations.Scheduling
{
    public class EventConfiguration : ModelBaseConfiguration<Event>
    {
        public override void Configure(EntityTypeBuilder<Event> builder)
        {
            base.Configure(builder);
            builder.ToTable("events", x =>
            {
                x.HasCheckConstraint("CK_Events_SingleContext", @"((""PathCourseId"" IS NOT NULL)::int + (""TutoringWallId"" IS NOT NULL)::int + (""PathEnrollmentId"" IS NOT NULL)::int) = 1");
            });
            builder.Property(x => x.OrganiserId).IsRequired();
            builder.Property(x => x.Type).HasConversion<string>().HasMaxLength(50).IsRequired();
            builder.Property(x => x.Title).IsRequired().HasMaxLength(100).IsRequired(false);
            builder.Property(x => x.Description).IsRequired(false);
            builder.Property(x => x.StartTime).IsRequired();
            builder.Property(x => x.EndTime).IsRequired(false);
            builder.Property(x => x.PathCourseId).IsRequired(false);
            builder.Property(x => x.TutoringWallId).IsRequired(false);
            builder.Property(x => x.PathEnrollmentId).IsRequired(false);

            builder.HasOne(x => x.Organiser).WithMany().HasForeignKey(x => x.OrganiserId).OnDelete(DeleteBehavior.Restrict);
            builder.HasOne(x => x.PathCourse).WithMany().HasForeignKey(x => x.PathCourseId).IsRequired(false).OnDelete(DeleteBehavior.SetNull);
            builder.HasOne(x => x.TutoringWall).WithMany().HasForeignKey(x => x.TutoringWallId).IsRequired(false).OnDelete(DeleteBehavior.SetNull);
            builder.HasOne(x => x.Enrollment).WithMany().HasForeignKey(x => x.PathEnrollmentId).IsRequired(false).OnDelete(DeleteBehavior.SetNull);

        }
    }
}
