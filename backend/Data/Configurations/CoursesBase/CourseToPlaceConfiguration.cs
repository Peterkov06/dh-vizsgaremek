using backend.Modules.CoursesBase.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data.Configurations.CoursesBase
{
    public class CourseToPlaceConfiguration: ModelBaseConfiguration<CourseToPlace>
    {
        public override void Configure(EntityTypeBuilder<CourseToPlace> builder)
        {
            base.Configure(builder);
            builder.ToTable("course_to_places");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Online).IsRequired();

            builder.HasOne(x => x.CourseBase).WithMany(x => x.CourseToPlaces).HasForeignKey(x => x.CourseId).IsRequired().OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(x => x.City).WithMany().HasForeignKey(x => x.PlaceId).IsRequired(false).OnDelete(DeleteBehavior.Cascade);
        }
    }
}
