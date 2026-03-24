using backend.Data;
using backend.Modules.Engagement.DTOs;
using backend.Modules.Engagement.Models;
using backend.Modules.Shared.Results;

namespace backend.Modules.Engagement.Services
{
    public class CommunicationService : ICommunicationService
    {
        private readonly AppDbContext _db;

        public CommunicationService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<ServiceResult<Guid>> WriteCourseReview(CourseReviewCreatorDTO courseReviewCreatorDTO, string userId, CancellationToken ct)
        {
            var exists = _db.CourseReviews.Where(x => x.CourseId == courseReviewCreatorDTO.CourseId).Any(x => x.ReviewerId == userId);

            if (exists) {
                return ServiceResult<Guid>.Failure("Already reviewed the course");
            }

            var newReview = new CourseReview
            {
                ReviewerId = userId,
                Text = courseReviewCreatorDTO.Text,
                CourseId = courseReviewCreatorDTO.CourseId,
                WallId = courseReviewCreatorDTO.WallId,
                EnrollmentId = null,
                Recommended = courseReviewCreatorDTO.Recommended,
                ReviewScore = courseReviewCreatorDTO.ReviewScore,
            };

            _db.CourseReviews.Add(newReview);
            await _db.SaveChangesAsync(ct);

            return ServiceResult<Guid>.Success(newReview.Id);
        }
    }
}
