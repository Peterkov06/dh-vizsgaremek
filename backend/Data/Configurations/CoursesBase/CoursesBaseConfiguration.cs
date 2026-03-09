using backend.Modules.CoursesBase.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data.Configurations.CoursesBase
{
    public class CoursesBaseConfiguration : IEntityTypeConfiguration<CourseBaseModel>
    {
        public void Configure(EntityTypeBuilder<CourseBaseModel> builder)
        {
            builder.ToTable("courses_base");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.TeacherId).IsRequired().HasMaxLength(450);
            builder.Property(x => x.CourseName).IsRequired();
            builder.Property(x => x.Description).IsRequired();
            builder.Property(x => x.Type).IsRequired();
            builder.Property(x => x.CourseDomainId).IsRequired();
            builder.Property(x => x.CourseLevelId).IsRequired();
            builder.Property(x => x.Price).IsRequired().HasPrecision(18,2);
            builder.Property(x => x.FirstConsultationFree).IsRequired();
            builder.Property(x => x.PriceCurrencyId).IsRequired();
            builder.Property(builder => builder.Status).IsRequired();

            builder.HasOne(x => x.Teacher).WithMany(x => x.Courses).HasForeignKey(x => x.TeacherId).OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(x => x.CourseDomain).WithMany(x => x.Courses).HasForeignKey(x => x.CourseDomainId);

        }
    }
}
