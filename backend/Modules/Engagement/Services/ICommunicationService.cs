using backend.Modules.Engagement.DTOs;
using backend.Modules.Shared.Results;

namespace backend.Modules.Engagement.Services
{
    public interface ICommunicationService
    {
        Task<ServiceResult<Guid>> WriteCourseReview(CourseReviewCreatorDTO courseReviewCreatorDTO, string userId, CancellationToken ct);
        Task<ServiceResult> CreateChat(string teacherId, string studentId, CancellationToken ct);
    }
}
