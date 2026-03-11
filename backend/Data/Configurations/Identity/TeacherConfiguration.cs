using backend.Modules.Identity.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data.Configurations.Identity
{
    public class TeacherConfiguration : IEntityTypeConfiguration<Teacher>
    {
        public void Configure(EntityTypeBuilder<Teacher> builder)
        {
            builder.ToTable("teachers");
            builder.HasKey(t => t.TeacherId);

            builder.HasOne(t => t.User).WithOne().HasForeignKey<Teacher>(t => t.TeacherId).OnDelete(DeleteBehavior.Cascade);
        }
    }
}
