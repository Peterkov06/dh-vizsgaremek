using backend.Modules.Engagement.DTOs;
using backend.Modules.Shared.Results;

namespace backend.Modules.Engagement.Services
{
    public interface ICommunicationService
    {
        Task<ServiceResult<Guid>> WriteCourseReview(CourseReviewCreatorDTO courseReviewCreatorDTO, string userId, CancellationToken ct);
        Task<ServiceResult> CreateChat(string teacherId, string studentId, CancellationToken ct);
        Task<ServiceResult<List<ChatContactDTO>>> GetChatsContacts(string userId, string role, CancellationToken ct);
        Task<ServiceResult<Guid>> WriteMessage(string userId, string role, Guid chatId, WriteMessageDTO dto, CancellationToken ct);
        Task<ServiceResult<List<ChatMessageDTO>>> GetChatMessages(Guid chatId, string userId, CancellationToken ct);
    }
}
