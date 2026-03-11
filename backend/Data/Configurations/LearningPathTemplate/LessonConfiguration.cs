using backend.Modules.LearningPathTemplate.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data.Configurations.LearningPathTemplate
{
    public class LessonConfiguration : ModelBaseConfiguration<UnitLesson>
    {
        public override void Configure(EntityTypeBuilder<UnitLesson> builder)
        {
            base.Configure(builder);
            builder.ToTable("lessons");
            builder.Property(x => x.UnitId);
            builder.Property(x => x.Title).IsRequired().HasMaxLength(200);
            builder.Property(x => x.Description).IsRequired();
            builder.Property(x => x.HandInId).IsRequired(false);

            builder.HasOne(x => x.Unit).WithMany(x => x.Lessons).HasForeignKey(x => x.UnitId).IsRequired(false).OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(x => x.HandIn).WithMany().HasForeignKey(x => x.HandInId).IsRequired(false).OnDelete(DeleteBehavior.SetNull);
        }
    }
}
