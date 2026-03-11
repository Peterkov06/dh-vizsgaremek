using backend.Modules.Identity.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data.Configurations.Identity
{
    public class QualificationConfiguration: ModelBaseConfiguration<Qualification>
    {
        public override void Configure(EntityTypeBuilder<Qualification> builder)
        {
            base.Configure(builder);
            builder.ToTable("qualifications");
            builder.Property(x => x.Approved).IsRequired();
            builder.Property(x => x.QualificationType).IsRequired().HasMaxLength(255);

            builder.HasOne(x => x.Teacher).WithMany().HasForeignKey(x  => x.TeacherId).IsRequired().OnDelete(DeleteBehavior.Cascade);
        }
    }
}
