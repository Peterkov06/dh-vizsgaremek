using backend.Modules.Engagement.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data.Configurations.Engagement
{
    public class CourseReviewConfiguration: ModelBaseConfiguration<CourseReview>
    {
        public override void Configure(EntityTypeBuilder<CourseReview> builder)
        {
            base.Configure(builder);
            builder.ToTable("course_feedbacks", x =>
            {
                x.HasCheckConstraint("CK_CourseReviews_SingleContext", @"((""WallId"" IS NOT NULL)::int + (""EnrollmentId"" IS NOT NULL)::int) = 1");
            });
            builder.Property(x => x.Recommended).IsRequired();
            builder.Property(x => x.Text).IsRequired();
            builder.Property(x => x.ReviewScore).IsRequired();

            builder.HasOne(x => x.Course).WithMany(x => x.Reviews).HasForeignKey(x => x.CourseId).IsRequired().OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(x => x.Reviewer).WithMany().HasForeignKey(x => x.ReviewerId).OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(x => x.Wall).WithMany().HasForeignKey(x => x.WallId).IsRequired(false).OnDelete(DeleteBehavior.SetNull);
            builder.HasOne(x => x.Enrollment).WithMany().HasForeignKey(x => x.EnrollmentId).IsRequired(false).OnDelete(DeleteBehavior.SetNull);
        }
    }
}
