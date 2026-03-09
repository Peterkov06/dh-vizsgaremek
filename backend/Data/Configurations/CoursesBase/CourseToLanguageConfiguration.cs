using backend.Modules.CoursesBase.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data.Configurations.CoursesBase
{
    public class CourseToLanguageConfiguration : IEntityTypeConfiguration<CourseToLanguage>
    {
        public void Configure(EntityTypeBuilder<CourseToLanguage> builder)
        {
            builder.ToTable("courses_to_languages");
            builder.HasKey(x => new { x.CourseId, x.LanguageId });

            builder.HasOne(x => x.Course).WithMany(x => x.CourseToLanguages).HasForeignKey(x => x.CourseId).OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(x => x.Language).WithMany().HasForeignKey(x => x.LanguageId).OnDelete(DeleteBehavior.Cascade);
        }
    }
}
