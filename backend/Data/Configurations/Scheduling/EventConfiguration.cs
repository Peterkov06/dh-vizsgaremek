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
                x.HasCheckConstraint("CK_Events_SingleContext",
                    @"(
                        ""CourseBaseId"" IS NOT NULL AND 
                        (
                            (""PathEnrollmentId"" IS NOT NULL AND ""TutoringWallId"" IS NULL) OR
                            (""TutoringWallId"" IS NOT NULL AND ""PathEnrollmentId"" IS NULL) OR
                            (""PathEnrollmentId"" IS NULL AND ""TutoringWallId"" IS NULL)
                        )
                    )");
            });
            builder.Property(x => x.OrganiserId).IsRequired();
            builder.Property(x => x.Type).HasConversion<string>().HasMaxLength(50).IsRequired();
            builder.Property(x => x.Title).HasMaxLength(100).IsRequired(false);
            builder.Property(x => x.Description).IsRequired(false);
            builder.Property(x => x.StartTime).IsRequired();
            builder.Property(x => x.EndTime).IsRequired();
            builder.Property(x => x.CourseBaseId).IsRequired();
            builder.Property(x => x.TutoringWallId).IsRequired(false);
            builder.Property(x => x.PathEnrollmentId).IsRequired(false);

            builder.HasIndex(x => new { x.OrganiserId, x.StartTime })
                    .HasDatabaseName("IX_Events_OrganiserId_StartTime");

            builder.HasIndex(x => new { x.OrganiserId, x.EndTime })
                   .HasDatabaseName("IX_Events_OrganiserId_EndTime");

            builder.HasOne(x => x.Organiser).WithMany().HasForeignKey(x => x.OrganiserId).OnDelete(DeleteBehavior.Restrict);
            builder.HasOne(x => x.CourseBase).WithMany().HasForeignKey(x => x.CourseBaseId).IsRequired().OnDelete(DeleteBehavior.SetNull);
            builder.HasOne(x => x.TutoringWall).WithMany().HasForeignKey(x => x.TutoringWallId).IsRequired(false).OnDelete(DeleteBehavior.SetNull);
            builder.HasOne(x => x.Enrollment).WithMany().HasForeignKey(x => x.PathEnrollmentId).IsRequired(false).OnDelete(DeleteBehavior.SetNull);

        }
    }
}
