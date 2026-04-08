using backend.Modules.Shared.Results;
using backend.Modules.Tutoring.DTOs;

namespace backend.Modules.Tutoring.Services
{
    public interface ITutoringWallService
    {
        Task<ServiceResult<List<TutoringWallPostDTO>>> GetWallPosts(Guid wallId, CancellationToken ct);
        Task<ServiceResult<TutoringWallPostDTO>> GetOneWallPost(Guid wallId, Guid postId, CancellationToken ct);
        Task<ServiceResult<Guid>> PostOnWall(NewWallPostDTO postDTO, string posterId, CancellationToken ct);
        Task<ServiceResult<Guid>> PostHandinOnWall(NewHandinDTO handinDTO, string posterId, CancellationToken ct);
        Task<ServiceResult<Guid>> CommentOnPost(PostCommentCreationDTO commentCreationDTO, string senderId, CancellationToken ct);
        Task<ServiceResult<List<WallCommentDTO>>> GetPostAllComments(Guid postId, CancellationToken ct);
    }
}
