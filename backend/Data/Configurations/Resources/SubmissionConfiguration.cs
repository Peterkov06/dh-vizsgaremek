using backend.Modules.Resources.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data.Configurations.Resources
{
    public class SubmissionConfiguration: ModelBaseConfiguration<Submission>
    {
        public override void Configure(EntityTypeBuilder<Submission> builder)
        {
            base.Configure(builder);
            builder.ToTable("submissions");
            builder.Property(x => x.Text).IsRequired(false);

            builder.HasOne(x => x.Submitter).WithMany().HasForeignKey(x => x.SubmitterId).IsRequired().OnDelete(DeleteBehavior.SetNull);
            builder.HasOne(x => x.HandIn).WithMany(x => x.Submissions).HasForeignKey(x => x.HandInId).IsRequired().OnDelete(DeleteBehavior.Cascade);
        }
    }
}
