using backend.Modules.LearningPathTemplate.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data.Configurations.LearningPathTemplate
{
    public class LessonToContentConfiguration : IEntityTypeConfiguration<LessonToContent>
    {
        public void Configure(EntityTypeBuilder<LessonToContent> builder)
        {
            builder.ToTable("lessons_to_contents");
            builder.HasKey(x => new { x.LessonId, x.ContentId });

            builder.HasOne(x => x.Lesson).WithMany(x => x.Contents).HasForeignKey(x => x.LessonId).OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(x => x.Content).WithMany().HasForeignKey(x => x.ContentId).OnDelete(DeleteBehavior.Cascade);
        }
    }
}
