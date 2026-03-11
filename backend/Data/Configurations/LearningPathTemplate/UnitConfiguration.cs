using backend.Modules.LearningPathTemplate.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data.Configurations.LearningPathTemplate
{
    public class UnitConfiguration : ModelBaseConfiguration<Unit>
    {
        public override void Configure(EntityTypeBuilder<Unit> builder)
        {
            base.Configure(builder);
            builder.ToTable("learning_path_units");
            builder.Property(x => x.CourseId).IsRequired();
            builder.Property(x => x.Name).IsRequired().HasMaxLength(200);
            builder.Property(x => x.Description).IsRequired();

            builder.HasOne(x => x.Course).WithMany().HasForeignKey(x => x.CourseId).OnDelete(DeleteBehavior.Cascade);
        }
    }
}
