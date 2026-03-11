using backend.Modules.Resources.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data.Configurations.Resources
{
    public class HandInFeedbackConfiguration: ModelBaseConfiguration<HandInFeedback>
    {
        public override void Configure(EntityTypeBuilder<HandInFeedback> builder)
        {
            base.Configure(builder);
            builder.ToTable("hand_in_feedbacks");
            builder.Property(x => x.Text).IsRequired(false);
            builder.Property(x => x.Grade).IsRequired(false);
            builder.Property(x => x.Points).IsRequired(false);
            builder.Property(x => x.GraderId).IsRequired().HasMaxLength(450);

            builder.HasOne(x => x.Submission).WithOne(x => x.Feedback).IsRequired(false).OnDelete(DeleteBehavior.Cascade);
        }
    }
}
