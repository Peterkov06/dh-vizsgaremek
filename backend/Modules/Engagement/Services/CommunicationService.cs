using backend.Data;
using backend.Models;
using backend.Modules.Engagement.DTOs;
using backend.Modules.Engagement.Models;
using backend.Modules.Shared.Results;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace backend.Modules.Engagement.Services
{
    public class CommunicationService : ICommunicationService
    {
        private readonly AppDbContext _db;
        private readonly INotificationService _notificationService;

        public CommunicationService(AppDbContext db, INotificationService notificationService)
        {
            _db = db;
            _notificationService = notificationService;
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

        public async Task<ServiceResult<List<ChatContactDTO>>> GetChatsContacts(string userId, string role, CancellationToken ct = default)
        {
            var isTeacher = role == "Teacher";
            var chats = await _db.ChatRooms.Where(x => x.TeacherId == userId || x.StudentId == userId)
                .OrderBy(x => x.Messages.OrderByDescending(x => x.CreatedAt).FirstOrDefault().CreatedAt)
                .Select(x => new ChatContactDTO
                {
                    ChatId = x.Id,
                    ParticipantId = isTeacher ? x.StudentId : x.TeacherId,
                    ParticipantName = isTeacher ? x.Student.User.FullName : x.Teacher.User.FullName,
                    ParticipantNickname = isTeacher ? x.Student.User.Nickname : null,
                    CourseNumber = isTeacher ? _db.TutoringWalls.Where(tw => tw.TeacherId == userId && tw.StudentId == x.StudentId).Count() : null,
                    ParticipantImageURL = "",
                    NewMessage = x.Messages.Where(m => m.SenderId != userId)
                        .OrderByDescending(m => m.CreatedAt)
                        .Any(m => m.ReadAt == null),
                })
                .ToListAsync(ct);

            return ServiceResult<List<ChatContactDTO>>.Success(chats);
        }

        public async Task<ServiceResult<Guid>> WriteMessage(string userId, string role, Guid chatId, WriteMessageDTO dto, CancellationToken ct = default)
        {
            var newMessage = new ChatMessage
            {
                SenderId = userId,
                Text = dto.Text,
                ChatId = chatId,
            };

            _db.ChatMessages.Add(newMessage);

            switch (role)
            {
                case "Teacher":
                    var studentId = await _db.ChatRooms.Where(x => x.Id == chatId).Select(x => x.StudentId).FirstOrDefaultAsync(ct);
                    var teacherName = await _db.Users.Where(x => x.Id == userId).Select(x => x.FullName).FirstOrDefaultAsync(ct);
                    await _notificationService.NotifyAsync(studentId, NotificationType.Message, chatId, userId, teacherName, dto.Text);
                    break;
                case "Student":
                    var teacherId = await _db.ChatRooms.Where(x => x.Id == chatId).Select(x => x.TeacherId).FirstOrDefaultAsync(ct);
                    var studentName = await _db.Users.Where(x => x.Id == userId).Select(x => x.FullName).FirstOrDefaultAsync(ct);
                    await _notificationService.NotifyAsync(teacherId, NotificationType.Message, chatId, userId, studentName, dto.Text);
                    break;
                default:
                    break;
            }

            await _db.SaveChangesAsync(ct);
            return ServiceResult<Guid>.Success(newMessage.Id);
        }

        public async Task<ServiceResult<List<ChatMessageDTO>>> GetChatMessages(Guid chatId, string userId, CancellationToken ct = default)
        {
            var unreadChatNotifications = await _db.Notifications
                .Where(x => x.Type == NotificationType.Message && x.RecipientId == userId && x.IsRead == false)
                .Select(x => x.Id).ToListAsync(ct);

            await _notificationService.SetNotificationsToRead(unreadChatNotifications, ct);
            await MarkReadMessages(chatId, userId, ct);

            var messages = await _db.ChatMessages.Where(x => x.ChatId == chatId)
                .OrderBy(x => x.CreatedAt)
                .Select(x => new ChatMessageDTO
                {
                    SenderId = x.SenderId,
                    SenderName = x.User.FullName,
                    Text = x.Text,
                    IsOwn = x.SenderId == userId,
                    IsRead = x.ReadAt != null,
                    SenderImage = "",
                    SentTime = x.CreatedAt,
                })
                .ToListAsync(ct);


            return ServiceResult<List<ChatMessageDTO>>.Success(messages);
        }

        public async Task<ServiceResult> MarkReadMessages(Guid chatId, string userId, CancellationToken ct = default)
        {
            var messages = await _db.ChatMessages
                .Where(x => x.ChatId == chatId && x.SenderId != userId && x.ReadAt == null)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(n => n.ReadAt, DateTime.UtcNow),
                ct);

            return ServiceResult.Success();
        }
    }
}
