using backend.Data;
using backend.Modules.Engagement.Models;
using backend.Modules.Engagement.Services;
using backend.Modules.Identity.Models;
using backend.Modules.Resources.Models;
using backend.Modules.Shared.Results;
using backend.Modules.Tutoring.DTOs;
using backend.Modules.Tutoring.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Modules.Tutoring.Services
{
    public class TutoringWallService : ITutoringWallService
    {
        private readonly AppDbContext _db;
        private readonly INotificationService _notificationService;

        public TutoringWallService(AppDbContext db, INotificationService notificationService)
        {
            _db = db;
            _notificationService = notificationService;
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
                .Where(x => x.WallId == wallId).Include(x => x.Attachments).ThenInclude(x => x.Content).Include(x => x.TutoringWall).ThenInclude(x => x.CourseBase).ThenInclude(x => x.Teacher).ThenInclude(x => x.User).ThenInclude(x => x.ProfilePicture).Include(x => x.Comments).Include(x => x.HandIn)
                .OrderByDescending(x => x.CreatedAt)
                .Select(x => new TutoringWallPostDTO
                {
                    Id = x.Id,
                    PosterName = x.TutoringWall.CourseBase.Teacher.User.FullName ?? "",
                    PosterId = x.TutoringWall.CourseBase.TeacherId ?? "",
                    PosterImg = x.TutoringWall.CourseBase.Teacher.User.ProfilePicture.FileName ?? "",
                    Text = x.Text,
                    Title = x.HandIn.Title ?? null,
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

            var studentId = await _db.TutoringWalls.Where(x => x.Id == postDTO.WallId).Select(x => x.StudentId).FirstAsync(ct);

            await _notificationService.NotifyAsync(studentId, NotificationType.WallPost, referenceId: postDTO.WallId, senderId: posterId);

            await _db.SaveChangesAsync(ct);


            return ServiceResult<Guid>.Success(newPost.Id);
        }

        public async Task<ServiceResult<Guid>> PostHandinOnWall(NewHandinDTO handinDTO, string posterId, CancellationToken ct = default)
        {
            var newHandIn = new HandIn
            {
                DueDate = handinDTO.DueDate,
                Type = handinDTO.Type,
                MaxPoints = handinDTO.MaxPoints,
                WallId = handinDTO.WallId,
                Title = handinDTO.Title
            };

            var newPost = new TutoringWallPost
            {
                WallId = handinDTO.WallId,
                Text = handinDTO.Text,
                HandInId = newHandIn.Id,
                HandIn = newHandIn,
            };
            _db.TutoringWallPosts.Add(newPost);

            var studentId = await _db.TutoringWalls.Where(x => x.Id == handinDTO.WallId).Select(x => x.StudentId).FirstAsync(ct);

            await _notificationService.NotifyAsync(studentId, NotificationType.NewHandIn, referenceId: handinDTO.WallId, senderId: posterId);

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

            var recipientId = await _db.TutoringWalls.Where(x => x.Id == commentCreationDTO.WallId).Select(x => x.StudentId == senderId ? x.TeacherId : x.StudentId).FirstAsync(ct);
            await _notificationService.NotifyAsync(recipientId, NotificationType.WallPost, referenceId: commentCreationDTO.WallId, senderId: senderId);

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
