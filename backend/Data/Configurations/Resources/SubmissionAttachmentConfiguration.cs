using backend.Modules.Resources.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data.Configurations.Resources
{
    public class SubmissionAttachmentConfiguration: ModelBaseConfiguration<SubmissionAttachment>
    {
        public override void Configure(EntityTypeBuilder<SubmissionAttachment> builder)
        {
            base.Configure(builder);
            builder.ToTable("submission_attachments");
            
            builder.HasOne(x => x.Submission).WithMany(x => x.Attachments).HasForeignKey(x => x.SubmissionId).OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(x => x.Content).WithMany().HasForeignKey(x => x.ContentId).OnDelete(DeleteBehavior.Cascade);
        }
    }
}
