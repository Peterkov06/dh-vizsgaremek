using backend.Data;
using backend.Modules.Engagement.DTOs;
using backend.Modules.Engagement.Models;
using backend.Modules.Shared.Results;
using Microsoft.EntityFrameworkCore;

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

        public async Task<ServiceResult> CreateChat(string teacherId, string studentId, CancellationToken ct = default)
        {
            var exists = await _db.ChatRooms.Where(x => x.TeacherId == teacherId && x.StudentId == studentId).AnyAsync(ct);

            if (!exists)
            {
                _db.ChatRooms.Add(new ChatRoom { StudentId = studentId, TeacherId = teacherId });
                await _db.SaveChangesAsync(ct);
            }
            return ServiceResult.Success();
        }
    }
}
