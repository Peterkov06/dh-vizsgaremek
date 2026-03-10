using backend.Modules.CoursesBase.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data.Configurations.CoursesBase
{
    public class CourseDomainConfiguration : ModelBaseConfiguration<CourseDomain>
    {
        public override void Configure(EntityTypeBuilder<CourseDomain> builder)
        {
            base.Configure(builder);
            builder.ToTable("course_domains");
            builder.Property(x => x.Name).IsRequired().HasMaxLength(100);
            builder.HasIndex(x => x.Name).IsUnique();
        }
    }
}
