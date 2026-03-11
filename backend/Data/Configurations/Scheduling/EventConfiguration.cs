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
                x.HasCheckConstraint("CK_Events_SingleContext", @"(""PathCourseId"" IS NOT NULL)::int + (""TutoringRoomId"" IS NOT NULL)::int + (""PathEnrollmentId"" IS NOT NULL)::int) = 1");
            });
            builder.Property(x => x.OrganiserId).HasMaxLength(450);
            builder.Property(x => x.Type).HasConversion<string>().HasMaxLength(50);
            builder.Property(x => x.Title).IsRequired().HasMaxLength(100);
            builder.Property(x => x.Description).IsRequired(false);

        }
    }
}
