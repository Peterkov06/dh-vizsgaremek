using backend.Modules.Shared.Results;
using backend.Modules.Tutoring.DTOs;

namespace backend.Modules.Tutoring.Services
{
    public interface ITutoringWallService
    {
        Task<ServiceResult<List<TutoringWallPostDTO>>> GetWallPosts(Guid wallId, CancellationToken ct);
        Task<ServiceResult<Guid>> PostOnWall(NewWallPostDTO postDTO, string posterId, CancellationToken ct);
    }
}
