using backend.Modules.Scheduling.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data.Configurations.Scheduling
{
    public class TeacherTimeblockConfiguration: ModelBaseConfiguration<TeacherTimeblock>
    {
        public override void Configure(EntityTypeBuilder<TeacherTimeblock> builder)
        {
            base.Configure(builder);
            builder.ToTable("teacher_timeblocks");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Start).IsRequired();
            builder.Property(x => x.End).IsRequired();

            builder.HasOne(x => x.Teacher).WithMany(x => x.TeacherTimeblocks).HasForeignKey(x => x.TeacherId).IsRequired().OnDelete(DeleteBehavior.Cascade);
        }
    }
}
