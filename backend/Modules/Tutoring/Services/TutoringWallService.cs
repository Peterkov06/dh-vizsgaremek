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

        public async Task<ServiceResult<TutoringWallPostDTO>> GetOneWallPost(Guid wallId, Guid postId, CancellationToken ct)
        {
            var post = await _db.TutoringWallPosts
                .Where(x => x.WallId == wallId && x.Id == postId)
                .Include(x => x.Attachments).ThenInclude(x => x.Content)
                .Include(x => x.TutoringWall).ThenInclude(x => x.CourseBase).ThenInclude(x => x.Teacher).ThenInclude(x => x.User).ThenInclude(x => x.ProfilePicture)
                .Include(x => x.Comments)
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
                    AttachmentURLs = x.Attachments.Select(x => x.Content.File.StoragePath).ToList(),
                    Comments = x.Comments.Select(x => new WallCommentDTO
                    {
                        SenderId = x.SenderId,
                        SenderImg = x.Sender.ProfilePicture.StoragePath ?? "",
                        SenderName = x.Sender.FullName,
                        SentTime = x.CreatedAt,
                        Text = x.Text
                    }).ToList(),
                })
                .FirstOrDefaultAsync(ct);
            if (post is null)
            {
                return ServiceResult<TutoringWallPostDTO>.NotFound("No post found");
            }
            return ServiceResult<TutoringWallPostDTO>.Success(post);
        }

        public async Task<ServiceResult<List<TutoringWallPostDTO>>> GetWallPosts(Guid wallId, CancellationToken ct)
        {
            var posts = await _db.TutoringWallPosts
                .Where(x => x.WallId == wallId).Include(x => x.Attachments).ThenInclude(x => x.Content).Include(x => x.TutoringWall).ThenInclude(x => x.CourseBase).ThenInclude(x => x.Teacher).ThenInclude(x => x.User).ThenInclude(x => x.ProfilePicture).Include(x => x.Comments)
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
                    AttachmentURLs = x.Attachments.Select(x => x.Content.File.StoragePath).ToList(),
                    Comments = x.Comments.Select(x => new WallCommentDTO
                    {
                        SenderId = x.SenderId,
                        SenderImg = x.Sender.ProfilePicture.StoragePath ?? "",
                        SenderName = x.Sender.FullName,
                        SentTime = x.CreatedAt,
                        Text = x.Text
                    }).ToList(),
                })
                .ToListAsync(ct);
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

        public async Task<ServiceResult<Guid>> CommentOnPost(PostCommentCreationDTO commentCreationDTO, string senderId, CancellationToken ct)
        {
            var newComment = new WallPostComment
            {
                SenderId = senderId,
                PostId = commentCreationDTO.PostId,
                WallId = commentCreationDTO.WallId,
                Text = commentCreationDTO.Text
            };
            _db.WallPostComments.Add(newComment);
            await _db.SaveChangesAsync(ct);
            return ServiceResult<Guid>.Success(newComment.Id);
        }

        public async Task<ServiceResult<List<WallCommentDTO>>> GetPostAllComments(Guid postId, CancellationToken ct)
        {
            var comments = await _db.WallPostComments.Where(x => x.PostId == postId).Include(x => x.Sender).ThenInclude(x => x.ProfilePicture).Select(x => new WallCommentDTO
            {
                SenderId=x.SenderId,
                SenderImg = x.Sender.ProfilePicture.StoragePath ?? "",
                SenderName = x.Sender.FullName,
                SentTime = x.CreatedAt,
                Text = x.Text
            }).ToListAsync(ct);

            return ServiceResult<List<WallCommentDTO>>.Success(comments);
        }
    }
}
