using backend.Data;
using backend.Models;
using backend.Modules.CoursesBase.Models;
using backend.Modules.CoursesBase.Services;
using backend.Modules.Engagement.DTOs;
using backend.Modules.Engagement.Models;
using backend.Modules.Identity.Models;
using backend.Modules.Pages.Shared.DTOs;
using backend.Modules.Pages.Student.DTOs;
using backend.Modules.Pages.Teacher.DTOs;
using backend.Modules.Payment.Models;
using backend.Modules.Payment.Services;
using backend.Modules.Resources.Models;
using backend.Modules.Scheduling.Models;
using backend.Modules.Shared.DTOs;
using backend.Modules.Shared.Models;
using backend.Modules.Shared.Results;
using backend.Modules.Shared.Services;
using backend.Modules.Tutoring.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace backend.Modules.Pages.Teacher.Services
{
    public class TeacherPageService : ITeacherPageService
    {
        private readonly ILookUpService _lookUpService;
        private readonly ICourseMetadataService _courseMetadataService;
        private readonly IPaymentService _paymentService;
        private readonly AppDbContext _db;

        public TeacherPageService(ILookUpService lookUpService, ICourseMetadataService courseMetadataService, IPaymentService paymentService, AppDbContext db)
        {
            _lookUpService = lookUpService;
            _courseMetadataService = courseMetadataService;
            _paymentService = paymentService;
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

            var courses = await _db.CourseBases
                .Where(c => c.TeacherId == userId && c.Status == CourseStatus.Active)
                .OrderByDescending(c => c.CreatedAt)
                .Take(10)
                .Select(c => new CourseCardDTO
                {
                    CourseId = c.Id,
                    CourseName = c.CourseName,
                    ImageUrl = c.BannerImage != null ? c.BannerImage.StoragePath : null,
                    CourseType = c.Type.ToString(),
                    EnrolledStudents = _db.TutoringWalls.Count(w => w.CourseId == c.Id && w.Status == EnrollmentStatus.Active)
                                        + _db.PathEnrollments.Count(e => e.CourseId == c.Id && e.Status == EnrollmentStatus.Active)
                })
                .AsNoTracking()
                .ToListAsync(ct);

            var pendingStudents = await _db.TutoringWalls
                .Where(w => w.TeacherId == userId && w.Status == EnrollmentStatus.Pending)
                .Select(w => new EnrollmentItemDTO
                {
                    CourseId = w.CourseId,
                    CourseName = w.CourseBase.CourseName,
                    EnrollmentDate = w.CreatedAt,
                    EnrollmentId = w.Id,
                    UserId = w.StudentId,
                    UserName = w.Student.User.FullName,
                    ProfilePictureUrl = w.Student.User.ProfilePicture != null
                        ? w.Student.User.ProfilePicture.StoragePath : null,
                })
                .AsNoTracking()
                .ToListAsync(ct);

            var pendingPayments = await _db.Invoices
                .Where(i => i.Status == PaymentStatus.Pending
                    && (i.Wall != null && i.Wall.TeacherId == userId
                     || i.Enrollment != null && i.Enrollment.Course.TeacherId == userId))
                .OrderByDescending(x => x.CreatedAt)
                .Select(i => new PaymentItemDTO
                {
                    CourseId = i.Wall != null ? (Guid)i.Wall.CourseId : i.Enrollment != null ? (Guid)i.Enrollment.CourseId : Guid.Empty,
                    InstanceId = i.WallId != null ? (Guid)i.WallId : i.EnrollmentId != null ? (Guid)i.EnrollmentId : Guid.Empty,
                    CourseName = i.Enrollment != null ? i.Enrollment.Course.CourseName
                                    : i.Wall != null ? i.Wall.CourseBase.CourseName : string.Empty,
                    UserId = i.UserId,
                    UserName = i.User.UserName ?? string.Empty,
                    PaymentValue = i.PaidPrice,
                    PaymentCurrency = i.Currency.CurrencySymbol,
                    TokenCount = i.TokenCount,
                    PaymentDate = i.CreatedAt,
                    InvoiceId = i.Id,
                    ProfilePictureUrl = i.User.ProfilePicture.StoragePath ?? null
                })
                .AsNoTracking()
                .ToListAsync(ct);

            var students = await _db.Students
                .Where(s =>
                    _db.TutoringWalls.Any(w => w.StudentId == s.UserId
                        && w.TeacherId == userId && w.Status == EnrollmentStatus.Active)
                 || _db.PathEnrollments.Any(e => e.AttendantId == s.UserId
                        && e.Course.TeacherId == userId && e.Status == EnrollmentStatus.Active))
                .OrderBy(x => x.User.FullName)
                .Select(s => new StudentItemDTO
                {
                    UserId = s.UserId,
                    FullName = s.User.FullName,
                    NickName = s.User.Nickname ?? string.Empty,
                    ProfilePictureUrl = s.User.ProfilePicture != null
                        ? s.User.ProfilePicture.StoragePath : null,

                    Courses = _db.TutoringWalls
                        .Where(w => w.StudentId == s.UserId && w.TeacherId == userId
                                 && w.Status == EnrollmentStatus.Active)
                        .Select(w => new LookUpDTO { Id = w.Id, Name = w.CourseBase.CourseName })
                        .ToList(),

                    ChatId = _db.ChatRooms
                        .Where(c => c.StudentId == s.UserId && c.TeacherId == userId)
                        .Select(c => (Guid?)c.Id)
                        .FirstOrDefault() ?? Guid.Empty,
                })
                .AsNoTracking()
                .ToListAsync(ct);

            var pendingSubmissions = await _db.Submissions
                .Where(s => s.TeacherId == userId && s.Feedback == null)
                .OrderByDescending(x => x.CreatedAt)
                .Select(s => new GradingItemDTO
                {
                    SubmissionId = s.Id,
                    SubmittedDate = s.CreatedAt,
                    Completed = false,
                    InstanceId = s.HandIn.WallId,
                    CourseName = s.HandIn.Wall.CourseBase.CourseName,
                    HandInTitle = s.HandIn.Title,
                    StudentName = s.Submitter.User.FullName,
                })
                .AsNoTracking()
                .ToListAsync(ct);

            var upcomingEvents = await _db.Events
                .Where(e => e.StartTime > DateTime.UtcNow
                    && (e.Enrollment != null && e.Enrollment.Course.TeacherId == userId
                     || e.TutoringWall != null && e.TutoringWall.TeacherId == userId))
                .OrderBy(e => e.StartTime)
                .Take(5)
                .Select(e => new UpcomingEventDTO
                {
                    EventId = e.Id,
                    Title = e.Title ?? string.Empty,
                    Description = e.Description ?? string.Empty,
                    StartTime = TimeOnly.FromDateTime(e.StartTime),
                    StartDate = DateOnly.FromDateTime(e.StartTime),
                    EventType = e.Type,
                    CourseName = e.CourseBase.CourseName ?? string.Empty,
                    ParticipantName = e.Enrollment != null ? e.Enrollment.Attendant.User.FullName
                                : e.TutoringWall != null ? e.TutoringWall.Student.User.FullName
                                : string.Empty,
                    ParticipantId = e.Enrollment != null ? e.Enrollment.AttendantId
                                : e.TutoringWall != null ? e.TutoringWall.StudentId
                                : string.Empty,
                    EndTime = TimeOnly.FromDateTime(e.EndTime),
                    InstanceId =
                        e.Type == EventType.Lesson ? (e.TutoringWallId ?? Guid.Empty) :
                        e.Type == EventType.Consultation ? (e.PathEnrollmentId ?? Guid.Empty) :
                        e.Type == EventType.Deadline ? (e.TutoringWallId ?? Guid.Empty) : 
                        Guid.Empty,
                })
                .AsNoTracking()
                .ToListAsync(ct);

            var notifications = await _db.Notifications
                .Where(n => n.RecipientId == userId && !n.IsRead)
                .OrderByDescending(n => n.CreatedAt)
                .Select(n => new NotificationDTO
                {
                    Id = n.Id,
                    Message = n.Message,
                    Type = n.Type,
                    CreatedAt = n.CreatedAt,
                    ReferenceId = n.ReferenceId,
                    Sender = n.SenderUser.FullName,
                    ReferenceText = n.ReferenceText
                })
                .AsNoTracking()
                .ToListAsync(ct);
            var lastUnread = notifications.FirstOrDefault();

            return ServiceResult<TeacherHomePageDTO>.Success(new TeacherHomePageDTO
            {
                ActiveCourses = courses,
                PendingEnrollments = pendingStudents,
                PendingPayments = pendingPayments,
                Students = students,
                GradingQueue = pendingSubmissions,
                UpcomingEvents = upcomingEvents,
                Notifications = new NotificationsDTO
                {
                    LastUnread = lastUnread is not null ? new LastUnreadNotificationDTO
                    {
                        FirstText = lastUnread.ReferenceText,
                        ReferenceId = lastUnread.ReferenceId ?? null,
                        NotificationId = lastUnread.Id,
                        SecondText = lastUnread.Type.ToString(),
                    } : null,
                    UnreadNotificationNumber = notifications.Count,
                }
            });
        }

        public async Task<ServiceResult<MyStudentsPageDTO>> GetStudentsPage(string userId, CancellationToken ct = default, string? searchText = null)
        {
            searchText = searchText?.ToLower();
            var students = await _db.Students
                .Where(s => _db.TutoringWalls
                    .Any(w => w.StudentId == s.UserId && w.TeacherId == userId && w.Status == EnrollmentStatus.Active))
                .Where(s => searchText == null
                    || s.User.FullName.ToLower().Contains(searchText)
                    || (s.User.Nickname != null && s.User.Nickname.ToLower().Contains(searchText)))
                .OrderBy(x => x.User.FullName)
                .Select(s => new MyStudentCardDTO
                {
                    StudentId = s.UserId,
                    Name = s.User.FullName,
                    StudentImageURL = s.User.ProfilePicture.StoragePath ?? null,
                    Nickname = s.User.Nickname ?? string.Empty,
                    CourseNumber = _db.TutoringWalls
                        .Count(w => w.StudentId == s.UserId && w.TeacherId == userId),

                    OngoingHandins = _db.TutoringWalls
                        .Where(w => w.StudentId == s.UserId && w.TeacherId == userId)
                        .SelectMany(w => w.WallPosts)
                        .Count(post => post.HandIn != null
                            && post.HandIn.Submissions.Any(sub => sub.Feedback == null)),

                    ChatId = _db.ChatRooms
                        .Where(c => c.StudentId == s.UserId && c.TeacherId == userId)
                        .Select(c => (Guid?)c.Id)
                        .FirstOrDefault() ?? Guid.Empty,

                    WallId = _db.TutoringWalls
                        .Where(w => w.StudentId == s.UserId && w.TeacherId == userId)
                        .OrderByDescending(w => w.CreatedAt)
                        .Select(w => w.Id)
                        .FirstOrDefault()
                })
                .ToListAsync(ct);

            return ServiceResult<MyStudentsPageDTO>.Success(
                new MyStudentsPageDTO
                {
                    LearningPath = [],
                    Tutoring = students
                }
            );
        }

        public async Task<ServiceResult<MyCoursesPageDTO>> GetMyCoursesPage(string userId, CancellationToken ct = default, string? searchText = null)
        {
            var tutoringCoursesQuery = _db.CourseBases.Where(x => x.TeacherId == userId && x.Type == CourseType.Tutoring && x.Status == CourseStatus.Active).AsQueryable();

            if (searchText is not null)
            {
                var searchtextLower = searchText.ToLower();
                tutoringCoursesQuery = tutoringCoursesQuery.Where(x => x.CourseName.ToLower().StartsWith(searchText));
            }

            var tutoringCourses = await tutoringCoursesQuery
                .OrderBy(x => x.CourseName)
                .Select(x => new MyCoursesCourseCardDTO
                {
                    CourseId = x.Id,
                    CourseName = x.CourseName,
                    Type = CourseType.Tutoring,
                    CourseBannerURL = x.BannerImage.StoragePath ?? null,
                    CoursePictureURL = x.Teacher.User.ProfilePicture.StoragePath ?? null,
                    Status = x.Status,
                    EnrolledStudents = _db.Students.Where(s => s.TutoringWalls.Where(t => t.CourseId == x.Id && t.Status == EnrollmentStatus.Active).Any()).Count(),
                    CourseRating = _db.CourseReviews.Where(cr => cr.CourseId == x.Id).Average(x => (int?)x.ReviewScore) ?? 0,
                    OngoingAssignments = _db.HandIns.Where(h => h.Wall.Id == x.Id && h.DueDate <= DateTime.UtcNow).Count(),
                    
                })
                .AsNoTracking()
                .ToListAsync(ct);


            var draftCourses = await _db.CourseBases.Where(x => x.TeacherId == userId && x.Status == CourseStatus.Draft)
                .OrderBy(x => x.CreatedAt)
                .Select(x => new DraftCourseDTO
                {
                    CourseId = x.Id,
                    CourseName = x.CourseName,
                    CourseBannerURL = x.BannerImage.StoragePath ?? null,
                    CoursePictureURL = x.IconImage.StoragePath ?? null,
                    Type = x.Type
                })
                .AsNoTracking()
                .ToListAsync(ct);

            return ServiceResult<MyCoursesPageDTO>.Success(new MyCoursesPageDTO
            {
                DraftCourses = draftCourses,
                TutoringCourses = tutoringCourses,
                PathCourses = []
            });

        }

        public async Task<ServiceResult<CourseStudentsPageDTO>> GetTutoringStudents(string userId, Guid courseId, string? searchText = null, CancellationToken ct = default)
        {
            searchText = searchText?.ToLower();
            var students = await _db.TutoringWalls
                .Where(x => x.CourseId == courseId && x.Status == EnrollmentStatus.Active)
                .Select(x => x.Student)
                .Where(s => searchText == null
                    || s.User.FullName.ToLower().Contains(searchText)
                    || (s.User.Nickname != null && s.User.Nickname.ToLower().Contains(searchText)))
                .OrderBy(x => x.User.FullName)
                .Select(s => new MyStudentCardDTO
                {
                    StudentId = s.UserId,
                    StudentImageURL = s.User.ProfilePicture.StoragePath ?? null,
                    Name = s.User.FullName,
                    Nickname = s.User.Nickname ?? string.Empty,
                    CourseNumber = _db.TutoringWalls
                        .Count(w => w.StudentId == s.UserId && w.TeacherId == userId),

                    OngoingHandins = _db.TutoringWalls
                        .Where(w => w.StudentId == s.UserId && w.TeacherId == userId)
                        .SelectMany(w => w.WallPosts)
                        .Count(post => post.HandIn != null
                            && post.HandIn.Submissions.Any(sub => sub.Feedback == null)),

                    ChatId = _db.ChatRooms
                        .Where(c => c.StudentId == s.UserId && c.TeacherId == userId)
                        .Select(c => (Guid?)c.Id)
                        .FirstOrDefault() ?? Guid.Empty,

                    WallId = _db.TutoringWalls
                        .Where(w => w.StudentId == s.UserId && w.TeacherId == userId)
                        .OrderByDescending(w => w.CreatedAt)
                        .Select(w => w.Id)
                        .FirstOrDefault()
                })
                .ToListAsync(ct);

            var pendingStudents = await _db.TutoringWalls
                .Where(w => w.CourseId == courseId && w.Status == EnrollmentStatus.Pending)
                .Select(w => new EnrollmentItemDTO
                {
                    CourseId = w.CourseId,
                    CourseName = w.CourseBase.CourseName,
                    EnrollmentDate = w.CreatedAt,
                    EnrollmentId = w.Id,
                    UserId = w.StudentId,
                    UserName = w.Student.User.FullName,
                    ProfilePictureUrl = w.Student.User.ProfilePicture != null
                        ? w.Student.User.ProfilePicture.StoragePath : null,
                })
                .AsNoTracking()
                .ToListAsync(ct);

            return ServiceResult<CourseStudentsPageDTO>.Success(new CourseStudentsPageDTO
            {
                PendingEnrollments = pendingStudents,
                Students = students,
            });
        }

        public async Task<ServiceResult<TeacherTutoringWallDTO>> GetTutoringWallData(Guid wallId, CancellationToken ct = default)
        {
            var walldata = await _db.TutoringWalls.Where(x => x.Id == wallId)
                .Select(x => new {
                    studentId = x.StudentId,
                    studentName = x.Student.User.FullName,
                    courseName = x.CourseBase.CourseName,
                    courseBaseId = x.CourseId,
                    bannerURL = x.CourseBase.BannerImage.StoragePath ?? null,
                    iconURL = x.CourseBase.IconImage.StoragePath ?? null,
                    tokens = x.TokenCount
                })
                .SingleOrDefaultAsync(ct);

            var now = DateTime.UtcNow;

            var nextHandins = await _db.Events
                .Where(x => x.TutoringWallId == wallId && x.StartTime > now && x.Type == EventType.Deadline)
                .OrderBy(x => x.StartTime)
                .Take(2)
                .Select(x => new TutoringWallEventCardDTO
                {
                    Description = x.Description,
                    StartDate = DateOnly.FromDateTime(x.StartTime),
                    StartTime = TimeOnly.FromDateTime(x.StartTime),
                    Title = x.Title,
                })
                .ToListAsync(ct);


            var nextLessons = await _db.Events
                .Where(x => x.TutoringWallId == wallId && x.StartTime > now && x.Type == EventType.Lesson)
                .OrderBy(x => x.StartTime)
                .Take(2)
                .Select(x => new TutoringWallEventCardDTO
                {
                    Description = x.Description,
                    StartDate = DateOnly.FromDateTime(x.StartTime),
                    StartTime = TimeOnly.FromDateTime(x.StartTime),
                    Title = x.Title,
                })
                .ToListAsync(ct);

            return ServiceResult<TeacherTutoringWallDTO>.Success(new TeacherTutoringWallDTO
            {
                CourseName = walldata.courseName,
                StudentId = walldata.studentId,
                StudentName = walldata.studentName,
                BannerURL = walldata.bannerURL,
                CourseBaseId = walldata.courseBaseId,
                IconURL = walldata.iconURL,
                InstanceId = wallId,
                NextHandins = nextHandins,
                NextLessons = nextLessons,
                TokenCount = walldata.tokens,
            });
        }

        public async Task<ServiceResult<TeacherInvoicesPageDTO>> GetInvoicesPage(string userId, CancellationToken ct)
        {
            var now = DateTime.UtcNow;
            var monthStart = new DateTime(now.Year, now.Month, 1, 0,0,0, DateTimeKind.Utc);
            var monthEnd = monthStart.AddMonths(1);
            var yearStart = new DateTime(now.Year, 1, 1, 0,0,0, DateTimeKind.Utc);
            var yearEnd = monthStart.AddYears(1);

            var allInvoices = await _paymentService.GetUserInvoices(userId, ct);
            var pendingInvoices = allInvoices.Data.Where(x => x.Status == PaymentStatus.Pending).OrderByDescending(x => x.CreatedAt).ToList();
            var invoices = allInvoices.Data.Where(x => x.Status != PaymentStatus.Pending).OrderByDescending(x => x.CreatedAt).ToList();

            var successfulInvoices = invoices.Where(x => x.Status == PaymentStatus.Accepted).ToList();
            var totalIncome = successfulInvoices.Sum(x => x.PaidPrice);
            var totalMonthIncome = successfulInvoices.Where(x => monthStart <= x.CreatedAt && x.CreatedAt < monthEnd).Sum(x => x.PaidPrice);
            var totalYearIncome = successfulInvoices.Where(x => yearStart <= x.CreatedAt && x.CreatedAt < yearEnd).Sum(x => x.PaidPrice);

            return ServiceResult<TeacherInvoicesPageDTO>.Success(new TeacherInvoicesPageDTO
            {
                PendingInvoices = pendingInvoices,
                CompletedInvoices = invoices,
                TotalIncome = totalIncome,
                MonthIncome = totalMonthIncome,
                YearIncome = totalYearIncome,
            });
        }
    }
}
