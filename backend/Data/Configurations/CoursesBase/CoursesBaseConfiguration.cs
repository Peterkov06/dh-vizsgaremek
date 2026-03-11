using backend.Modules.CoursesBase.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data.Configurations.CoursesBase
{
    public class CoursesBaseConfiguration : ModelBaseConfiguration<CourseBaseModel>
    {
        public override void Configure(EntityTypeBuilder<CourseBaseModel> builder)
        {
            base.Configure(builder);
            builder.ToTable("courses_base");
            builder.Property(x => x.TeacherId).IsRequired().HasMaxLength(450);
            builder.Property(x => x.CourseName).IsRequired().HasMaxLength(200);
            builder.Property(x => x.Description).IsRequired();
            builder.Property(x => x.Type).IsRequired().HasConversion<string>().HasMaxLength(50);
            builder.Property(x => x.CourseDomainId).IsRequired();
            builder.Property(x => x.CourseLevelId).IsRequired();
            builder.Property(x => x.Price).IsRequired().HasPrecision(18,2);
            builder.Property(x => x.FirstConsultationFree).IsRequired();
            builder.Property(x => x.PriceCurrencyId).IsRequired();
            builder.Property(x => x.Status).IsRequired().HasConversion<string>().HasMaxLength(50);

            builder.HasOne(x => x.Teacher).WithMany(x => x.Courses).HasForeignKey(x => x.TeacherId).OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(x => x.CourseDomain).WithMany().HasForeignKey(x => x.CourseDomainId).OnDelete(DeleteBehavior.Restrict);
            builder.HasOne(x => x.CourseLevel).WithMany().HasForeignKey(x => x.CourseLevelId).OnDelete(DeleteBehavior.Restrict);
            builder.HasOne(x => x.Currency).WithMany().HasForeignKey(x => x.PriceCurrencyId).OnDelete(DeleteBehavior.Restrict);

        }
    }
}
