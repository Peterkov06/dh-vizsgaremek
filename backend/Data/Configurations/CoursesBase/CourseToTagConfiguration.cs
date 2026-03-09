using backend.Modules.CoursesBase.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data.Configurations.CoursesBase
{
    public class CourseToTagConfiguration : IEntityTypeConfiguration<CourseToTag>
    {
        public void Configure(EntityTypeBuilder<CourseToTag> builder)
        {
            builder.ToTable("courses_to_tags");
            builder.HasKey(x => new { x.CourseId, x.TagId });

            builder.HasOne(x => x.Course).WithMany(x => x.CourseToTags).HasForeignKey(x => x.CourseId).OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(x => x.Tag).WithMany().HasForeignKey(x => x.TagId).OnDelete(DeleteBehavior.Cascade);
        }
    }
}
