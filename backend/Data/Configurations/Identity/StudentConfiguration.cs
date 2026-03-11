using backend.Modules.Identity.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data.Configurations.Identity
{
    public class StudentConfiguration : IEntityTypeConfiguration<Student>
    {
        public void Configure(EntityTypeBuilder<Student> builder)
        {
            builder.ToTable("students");
            builder.HasKey(s => s.UserId);

            builder.HasOne(s => s.User).WithOne().HasForeignKey<Student>(s => s.UserId).IsRequired().OnDelete(DeleteBehavior.Cascade);

        }
    }
}
