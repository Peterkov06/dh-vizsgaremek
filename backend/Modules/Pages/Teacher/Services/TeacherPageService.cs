using backend.Data;
using backend.Models;
using backend.Modules.CoursesBase.Models;
using backend.Modules.CoursesBase.Services;
using backend.Modules.Engagement.Models;
using backend.Modules.Identity.Models;
using backend.Modules.Pages.Shared.DTOs;
using backend.Modules.Pages.Teacher.DTOs;
using backend.Modules.Payment.Models;
using backend.Modules.Resources.Models;
using backend.Modules.Scheduling.Models;
using backend.Modules.Shared.DTOs;
using backend.Modules.Shared.Models;
using backend.Modules.Shared.Results;
using backend.Modules.Shared.Services;
using backend.Modules.Tutoring.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace backend.Modules.Pages.Teacher.Services
{
    public class TeacherPageService : ITeacherPageService
    {
        private readonly ILookUpService _lookUpService;
        private readonly ICourseMetadataService _courseMetadataService;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly AppDbContext _db;

        public TeacherPageService(ILookUpService lookUpService, ICourseMetadataService courseMetadataService, UserManager<ApplicationUser> userManager, AppDbContext db)
        {
            _lookUpService = lookUpService;
            _courseMetadataService = courseMetadataService;
            _userManager = userManager;
            _db = db;
        }

        public async Task<ServiceResult<CourseBaseCreationPageDTO>> GetCourseCreationPage(CancellationToken ct)
        {
            var currencies = await _lookUpService.GetCurrenciesAsync(ct);
            var languages = await _lookUpService.GetLanguagesAsync(ct);
            var levels = await _courseMetadataService.GetAllLevelsAsync(ct);
            var domains = await _courseMetadataService.GetAllDomainsAsync(ct);

            CourseBaseCreationPageDTO pageDTO = new ()
            {
                Currencies = currencies.Data,
                Domains = domains.Data,
                Levels = levels.Data,
                Languages = languages.Data,

            };

            return ServiceResult<CourseBaseCreationPageDTO>.Success(pageDTO);
            
        }

        public async Task<ServiceResult<TeacherHomePageDTO>> GetTeacherHomepage(string userId, CancellationToken ct)
        {
            var teacher = await _db.Teachers.Include(x => x.Courses).FirstOrDefaultAsync(x => x.TeacherId == userId, ct);
            if (teacher == null) 
            {
                return ServiceResult<TeacherHomePageDTO>.NotFound("No teacher found");
            }
            var courses = teacher.Courses.Where(x => x.Status == CourseStatus.Active).Take(10).Select(MapToCourseCardDTO).ToList();
            var pendingStudents = _db.TutoringWalls.Include(x => x.CourseBase)
                .Where(x => x.CourseBase.TeacherId == userId && x.Status == EnrollmentStatus.Pending)
                .Include(x => x.Student).ThenInclude(x => x.User)
                .Select(MapToEnrollmentDTO).ToList();
            var pendingPayments = _db.Invoices
                .Include(x => x.Wall).ThenInclude(x => x.CourseBase)
                .Include(x => x.Enrollment).ThenInclude(x => x.Course)
                .Where(x => x.Status == PaymentStatus.Pending && (x.Wall.CourseBase.TeacherId == userId || x.Enrollment.Course.TeacherId == userId))
                .Select(MapToPaymentItemDTO).ToList();
            var students = await _db.Students.Include(x => x.TutoringWalls).ThenInclude(x => x.CourseBase)
                .Include(x => x.LearningPathEnrollments).ThenInclude(x => x.Course)
                .Where(x => x.TutoringWalls.Where(x => x.Status == EnrollmentStatus.Active).Any(x => x.CourseBase.TeacherId == userId) || x.LearningPathEnrollments.Where(x => x.Status == EnrollmentStatus.Active).Any(x => x.Course.TeacherId == userId))
                .Include(x => x.Chats)
                .Include(x => x.User)
                .Select(x => MapToStudentDTO(x, userId)).ToListAsync(ct);
            var pendingSubmissions = await _db.Submissions
                .Include(x => x.Feedback)
                .Where(x => x.TeacherId == userId && x.Feedback == null)
                .Select(x => MapToSubmissionDTO(x)).ToListAsync(ct);
            var upcomingEvents = await _db.Events
                .Include(x => x.TutoringWall).ThenInclude(x => x.CourseBase)
                .Include(x => x.Enrollment).ThenInclude(x => x.Course)
                .Where(x => (x.Enrollment != null && x.Enrollment.Course.TeacherId == userId) || (x.TutoringWall != null && x.TutoringWall.CourseBase.TeacherId == userId)).Where(x => x.StartTime > DateTime.UtcNow)
                .OrderBy(x => x.StartTime).Take(5)
                .Include(x => x.PathCourse).ToListAsync(ct);
            var notifications = await _db.Notifications
                .Where(x => x.RecipientId == userId && !x.IsRead)
                .OrderByDescending(x => x.CreatedAt).ToListAsync(ct);
            var lastNotification = notifications.FirstOrDefault();

            return ServiceResult<TeacherHomePageDTO>.Success(new TeacherHomePageDTO
            {
                Notifications = new NotificationsDTO
                {
                    LastUnread = null,
                    UnreadNotificationNumber = notifications.Count,
                },
                ActiveCourses = courses,
                GradingQueue = pendingSubmissions, 
                PendingEnrollments = pendingStudents,
                PendingPayments = pendingPayments,
                Students = students,
                UpcomingEvents = upcomingEvents.Select(x => new UpcomingEventDTO
                {
                    EventId = x.Id,
                    Title = x.Title,
                    CourseName = x.PathCourse?.CourseName ?? x.TutoringWall?.CourseBase?.CourseName ?? "",
                    TeacherName = x.PathCourse?.Teacher?.User?.FullName ?? x.TutoringWall?.CourseBase?.Teacher?.User?.FullName ?? "",
                    StartTime = TimeOnly.FromDateTime(x.StartTime),
                    StartDate = DateOnly.FromDateTime(x.StartTime),
                    EventType = x.Type.ToString(),
                    Description = x.Description ?? "",
                    EventUrl = x.Type switch
                    {
                        EventType.Lesson => $"#",
                        EventType.Deadline => $"#",
                        _ => "#"
                    }
                }).ToList()
            });
        }

        public static CourseCardDTO MapToCourseCardDTO(CourseBaseModel course)
        {
            return new CourseCardDTO
            {
                CourseId = course.Id,
                CourseName = course.CourseName,
                ImageUrl = course.IconImage?.StoragePath ?? string.Empty,
                CourseType = course.Type.ToString(),
                EnrolledStudents = 0
            };
        }

        public static EnrollmentItemDTO MapToEnrollmentDTO(TutoringWall wall)
        {
            return new EnrollmentItemDTO
            {
                CourseId = wall.CourseId,
                CourseName = wall.CourseBase.CourseName,
                EnrollmentDate = wall.CreatedAt,
                EnrollmentId = wall.Id,
                UserId = wall.StudentId,
                UserName = wall.Student.User.FullName,
                ProfilePictureUrl = "",
            }; 
        }
        public static PaymentItemDTO MapToPaymentItemDTO(Invoice invoice)
        {
            return new PaymentItemDTO
            {
                CourseId = invoice.Enrollment?.CourseId ?? Guid.Empty,
                InstanceId = invoice.Enrollment?.Id ?? Guid.Empty,
                CourseName = invoice.Enrollment?.Course?.CourseName ?? "",
                UserId = invoice.UserId,
                UserName = invoice.User?.UserName ?? "",
                PaymentValue = invoice.PaidPrice,
                PaymentCurrency = invoice.Currency?.CurrencySymbol ?? "",
                TokenCount = invoice.TokenCount,
                PaymentDate = invoice.CreatedAt,
                InvoiceId = invoice.Id
            };
        }
        public static StudentItemDTO MapToStudentDTO (Identity.Models.Student student, string teacherId)
        {
            return new StudentItemDTO
            {
                Courses = student.TutoringWalls.Where(x => x.Status == EnrollmentStatus.Active && x.CourseBase.TeacherId == teacherId).Select(x => new LookUpDTO { Id = x.Id, Name = x.CourseBase.CourseName })
                .Union(student.LearningPathEnrollments.Where(x => x.Status == EnrollmentStatus.Active && x.Course.TeacherId == teacherId).Select(x => new LookUpDTO { Id = x.Id, Name = x.Course.CourseName })).ToList(),
                ChatId = student.Chats?.FirstOrDefault(x => x.TeacherId == teacherId).Id ?? Guid.Empty,
                FullName = student.User.FullName ?? "",
                NickName = student.User.Nickname ?? "",
                UserId = student.UserId,
                ProfilePictureUrl = ""
            };
        }
        public static GradingItemDTO MapToSubmissionDTO(Submission submission)
        {
            return new GradingItemDTO
            {
                Completed = false,
                InstanceId = submission.HandIn.WallId,
                CourseName = submission.HandIn.Wall.CourseBase.CourseName,
                HandInTitle = submission.HandIn.Title,
                StudentName = submission.Submitter.User.FullName,
                SubmissionId = submission.Id,
                SubmittedDate = submission.CreatedAt,
            };
        }
    }
}
