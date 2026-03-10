using backend.Modules.CoursesBase.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data.Configurations.CoursesBase
{
    public class CourseTagConfiguration : ModelBaseConfiguration<CourseTag>
    {
        public override void Configure(EntityTypeBuilder<CourseTag> builder)
        {
            base.Configure(builder);
            builder.ToTable("course_tags");
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Name).IsRequired().HasMaxLength(100);
            builder.HasIndex(x => x.Name).IsUnique();
        }
    }
}
