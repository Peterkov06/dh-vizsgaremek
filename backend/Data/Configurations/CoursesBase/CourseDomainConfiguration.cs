using backend.Modules.Shared.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data.Configurations.CoursesBase
{
    public class CourseDomainConfiguration : ModelBaseConfiguration<LookUp>
    {
        public override void Configure(EntityTypeBuilder<LookUp> builder)
        {
            base.Configure(builder);
            builder.ToTable("course_domains");
            builder.Property(x => x.Name).IsRequired().HasMaxLength(100);
            builder.HasIndex(x => x.Name).IsUnique();
        }
    }
}
