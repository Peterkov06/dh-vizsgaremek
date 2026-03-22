using backend.Data;
using backend.Modules.Shared.Results;
using backend.Modules.Tutoring.DTOs;
using backend.Modules.Tutoring.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Modules.Tutoring.Services
{
    public class TutoringWallService : ITutoringWallService
    {
        private readonly AppDbContext _db;

        public TutoringWallService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<ServiceResult<List<TutoringWallPostDTO>>> GetWallPosts(Guid wallId, CancellationToken ct)
        {
            var posts = await _db.TutoringWallPosts
                .Where(x => x.WallId == wallId).Include(x => x.Attachments).ThenInclude(x => x.Content).Include(x => x.TutoringWall).ThenInclude(x => x.CourseBase).ThenInclude(x => x.Teacher).ThenInclude(x => x.User).ThenInclude(x => x.ProfilePicture)
                .OrderByDescending(x => x.CreatedAt)
                .Select(x => new TutoringWallPostDTO
                {
                    Id = x.Id,
                    PosterName = x.TutoringWall.CourseBase.Teacher.User.FullName ?? "",
                    PosterId = x.TutoringWall.CourseBase.TeacherId ?? "",
                    PosterImg = x.TutoringWall.CourseBase.Teacher.User.ProfilePicture.FileName ?? "",
                    Text = x.Text,
                    HandInId = x.HandInId,
                    CreatedAt = x.CreatedAt,
                    UpdatedAt = x.UpdatedAt,
                    AttachmentURLs = x.Attachments.Select(x => x.Content.File.StoragePath).ToList()
                })
                .ToListAsync();
            return ServiceResult<List<TutoringWallPostDTO>>.Success(posts);
        }

        public async Task<ServiceResult<Guid>> PostOnWall(NewWallPostDTO postDTO, string posterId, CancellationToken ct)
        {
            var newPost = new TutoringWallPost
            {
                WallId = postDTO.WallId,
                Text = postDTO.Text,
                HandInId = null,
            };
            _db.TutoringWallPosts.Add(newPost);
            await _db.SaveChangesAsync(ct);
            return ServiceResult<Guid>.Success(newPost.Id);
        }
    }
}
