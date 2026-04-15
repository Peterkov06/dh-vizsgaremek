using backend.Data;
using backend.Modules.CoursesBase.Models;
using backend.Modules.Pages.Shared.DTOs;
using backend.Modules.Pages.Student.DTOs;
using backend.Modules.Pages.Teacher.DTOs;
using backend.Modules.Payment.Models;
using backend.Modules.Payment.Services;
using backend.Modules.Progression.Models;
using backend.Modules.Scheduling.Models;
using backend.Modules.Shared.DTOs;
using backend.Modules.Shared.Models;
using backend.Modules.Shared.Results;
using Microsoft.EntityFrameworkCore;

namespace backend.Modules.Pages.Student.Services
{
    public class StudentPageService : IStudentPageService
    {
        private readonly AppDbContext _db;
        private readonly IPaymentService _paymentService;

        public StudentPageService(AppDbContext db, IPaymentService paymentService)
        {
            _db = db;
            _paymentService = paymentService;
        }

        public async Task<ServiceResult<StudentHomePageDTO>> GetStudentHomePageAsync(string userId, CancellationToken ct)
        {
            var now = DateTime.UtcNow;
            var walls = await _db.TutoringWalls.Where(x => x.StudentId == userId).Include(x => x.CourseBase).ThenInclude(x => x.Teacher).ThenInclude(x => x.User).ThenInclude(x => x.ProfilePicture).Include(x => x.CourseBase).ThenInclude(x => x.BannerImage).OrderBy(x => x.UpdatedAt).AsNoTracking().ToListAsync(ct);
            var paths = await _db.PathEnrollments.Where(x => x.AttendantId == userId).Include(x => x.Course).ThenInclude(x => x.Teacher).ThenInclude(x => x.User).ThenInclude(x => x.ProfilePicture).Include(x => x.Course).ThenInclude(x => x.BannerImage).OrderBy(x => x.UpdatedAt).AsNoTracking().ToListAsync(ct);
            var upcomingEvents = await _db.Events
                .Include(x => x.TutoringWall).ThenInclude(x => x.CourseBase).Include(x => x.Enrollment)
                .Where(x => (x.Enrollment != null && x.Enrollment.AttendantId == userId) || (x.TutoringWall != null && x.TutoringWall.StudentId == userId)).Where(x => x.StartTime > now)
                .OrderBy(x => x.StartTime)
                .Include(x => x.CourseBase).AsNoTracking().ToListAsync(ct);
            var notifications = await _db.Notifications
                .Where(x => x.RecipientId == userId && !x.IsRead)
                .OrderByDescending(x => x.CreatedAt).AsNoTracking().ToListAsync(ct);
            var popularCourses = await _db.CourseBases.Where(x => x.Status == CourseStatus.Active).Include(x => x.Teacher).ThenInclude(x => x.User).ThenInclude(x => x.ProfilePicture).Include(x => x.Currency).Include(x => x.BannerImage).OrderByDescending(x => x.CreatedAt).Take(10).AsNoTracking().ToListAsync(ct);


            var activeWalls = walls.Where(x => x.Status == EnrollmentStatus.Active).Select(x => new AttendedCourseDTO
            {
                CourseId = x.CourseId,
                InstanceId = x.Id,
                CourseName = x.CourseBase?.CourseName ?? "",
                TeacherName = x.CourseBase?.Teacher?.User?.FullName ?? "",
                CourseType = "tutoring",
                Progress = x.TokenCount,
                CourseBannerURL = x.CourseBase?.BannerImage?.StoragePath ?? null,
                CourseIconURL = x.CourseBase?.Teacher?.User?.ProfilePicture?.StoragePath ?? null,
                UpcomingEvents = [.. upcomingEvents.Where(y => y.TutoringWallId == x.Id).Take(2).Select(MapToCourseCardUpcomingEventDTO)]
            }).ToList();
            
            var activePaths= paths.Where(x => x.Status == EnrollmentStatus.Active).Select(x => new AttendedCourseDTO
            {
                CourseId = x.CourseId,
                InstanceId = x.Id,
                CourseName = x.Course?.CourseName ?? "",
                TeacherName = x.Course?.Teacher?.User?.FullName ?? "",
                CourseType = "path",
                Progress = CalculateCourseProgress(x),
                CourseBannerURL = x.Course?.BannerImage?.StoragePath ?? null,
                CourseIconURL = x.Course?.Teacher?.User?.ProfilePicture?.StoragePath ?? null,
                UpcomingEvents = [.. upcomingEvents.Where(y => y.CourseBaseId == x.CourseId).Take(2).Select(MapToCourseCardUpcomingEventDTO)]
            }).ToList();

            var inactiveWalls = walls.Where(x => x.Status != EnrollmentStatus.Active).Select(x => new AttendedCourseDTO
            {
                CourseId = x.CourseId,
                InstanceId = x.Id,
                CourseName = x.CourseBase?.CourseName ?? "",
                TeacherName = x.CourseBase?.Teacher?.User?.FullName ?? "",
                CourseType = "tutoring",
                Progress = 0,
                CourseBannerURL = x.CourseBase?.BannerImage?.StoragePath ?? null,
                CourseIconURL = x.CourseBase?.Teacher?.User?.ProfilePicture?.StoragePath ?? null,
                UpcomingEvents = null
            }).ToList();

            var inactivePaths= paths.Where(x => x.Status != EnrollmentStatus.Active).Select(x => new AttendedCourseDTO
            {
                CourseId = x.CourseId,
                InstanceId = x.Id,
                CourseName = x.Course?.CourseName ?? "",
                TeacherName = x.Course?.Teacher?.User?.FullName ?? "",
                CourseType = "path",
                Progress = CalculateCourseProgress(x),
                CourseBannerURL = x.Course?.BannerImage?.StoragePath ?? null,
                CourseIconURL = x.Course?.Teacher?.User?.ProfilePicture?.StoragePath ?? null,
                UpcomingEvents = null
            }).ToList();

            var lastNotification = notifications.FirstOrDefault();

            return ServiceResult<StudentHomePageDTO>.Success(new StudentHomePageDTO
            {
                AttendedCourses = new()
                {
                    Active = [.. activeWalls, .. activePaths],
                    Inactive = [.. inactiveWalls, .. inactivePaths]
                },
                Notifications = new()
                {
                    UnreadNotificationNumber = notifications.Count,
                    LastUnread = lastNotification is not null ? new LastUnreadNotificationDTO { FirstText = lastNotification.Type.ToString(), NotificationId = lastNotification.Id, ReferenceId = lastNotification.ReferenceId, SecondText = lastNotification.ReferenceText } : null,
                },
                PopularCourses = popularCourses.Select(x => new PopularCourseDTO
                {
                    CourseId = x.Id,
                    CourseName = x.CourseName,
                    TeacherName = x.Teacher?.User?.FullName ?? "",
                    ImageUrl = x.BannerImage?.StoragePath ?? null,
                    LessonPrice = new()
                    {
                        Amount = x.Price,
                        Currency = x.Currency?.CurrencySymbol ?? "HUF"
                    },
                    Description = x.Description,
                    CourseType = x.Type.ToString()
                }).ToList(),
                UpcomingEvents = upcomingEvents.Take(5).Select(x => new UpcomingEventDTO
                {
                    EventId = x.Id,
                    Title = x.Title,
                    CourseName = x.CourseBase?.CourseName ?? x.TutoringWall?.CourseBase?.CourseName ?? "",
                    ParticipantName = x.CourseBase?.Teacher?.User?.FullName ?? x.TutoringWall?.CourseBase?.Teacher?.User?.FullName ?? "",
                    ParticipantId = x.OrganiserId,
                    StartTime = TimeOnly.FromDateTime(x.StartTime),
                    StartDate = DateOnly.FromDateTime(x.StartTime),
                    EventType = x.Type,
                    Description = x.Description ?? "",
                    EndTime = TimeOnly.FromDateTime(x.EndTime),
                    InstanceId = x.Type switch
                    {
                        EventType.Lesson => x.TutoringWallId ?? Guid.Empty,
                        EventType.Consultation => x.PathEnrollmentId ?? Guid.Empty,
                        EventType.Deadline => x.TutoringWallId ?? Guid.Empty,
                        _ => Guid.Empty,
                    },
                }).ToList()
            });
        }

        public async Task<ServiceResult<List<StudentMyCourseDTO>>> GetStudentMyCoursesPageAsync(string userId, CancellationToken ct)
        {
            var attendedTutoringCourses = await _db.TutoringWalls.Where(x => x.StudentId == userId).Include(x => x.CourseBase).ThenInclude(x => x.Teacher).ThenInclude(x => x.User).ThenInclude(x => x.ProfilePicture).Include(x => x.CourseBase).ThenInclude(x => x.BannerImage).OrderBy(x => x.UpdatedAt).AsNoTracking().ToListAsync(ct);
            var attendedPathCourses = await _db.PathEnrollments.Where(x => x.AttendantId == userId).Include(x => x.Course).ThenInclude(x => x.Teacher).ThenInclude(x => x.User).ThenInclude(x => x.ProfilePicture).Include(x => x.Course).ThenInclude(x => x.BannerImage).OrderBy(x => x.UpdatedAt).AsNoTracking().ToListAsync(ct);


            var courses = attendedTutoringCourses
                .OrderBy(x => x.CreatedAt)
                .Select(x => new StudentMyCourseDTO
                {
                    CourseBaseId = x.CourseBase?.Id ?? Guid.Empty,
                    InstanceId = x.Id,
                    CourseName = x.CourseBase.CourseName ?? string.Empty,
                    TeacherName = x.CourseBase?.Teacher?.User?.FullName ?? "",
                    TeacherId = x.CourseBase?.TeacherId ?? "",
                    CourseIconURL = x.CourseBase?.Teacher?.User?.ProfilePicture?.StoragePath ?? null,
                    CourseBannerURL = x.CourseBase?.BannerImage?.StoragePath ?? null,
                    Status = x.Status,
                    TeacherProfilePictureURL = x.CourseBase?.Teacher?.User?.ProfilePicture?.StoragePath ?? null,

                }).ToList();
            courses.AddRange(attendedPathCourses.OrderBy(x => x.CreatedAt).Select(x => new StudentMyCourseDTO
            {
                CourseBaseId = x.Course?.Id ?? Guid.Empty,
                InstanceId = x.Id,
                CourseName = x.Course?.CourseName ?? string.Empty,
                TeacherName = x.Course?.Teacher?.User?.FullName ?? "",
                TeacherId = x.Course?.TeacherId ?? "",
                CourseIconURL = x.Course?.Teacher?.User?.ProfilePicture?.StoragePath ?? null,
                CourseBannerURL = x.Course?.BannerImage?.StoragePath ?? null,
                Status = x.Status,
                TeacherProfilePictureURL = x.Course?.Teacher?.User?.ProfilePicture?.StoragePath ?? null,
            }));
            return ServiceResult<List<StudentMyCourseDTO>>.Success(courses);
        }

        public async Task<ServiceResult<StudentTutoringWallDTO>> GetTutoringWallData(Guid wallId, string userId, CancellationToken ct = default)
        {
            var walldata = await _db.TutoringWalls.Where(x => x.Id == wallId)
                .Select(x => new {
                    teacherId = x.TeacherId,
                    teacherName = x.Teacher.User.FullName,
                    courseName = x.CourseBase.CourseName,
                    courseBaseId = x.CourseId,
                    bannerURL = x.CourseBase.BannerImage.StoragePath ?? null,
                    iconURL = x.CourseBase.Teacher.User.ProfilePicture.StoragePath ?? null,
                    tokens = x.TokenCount,
                    tokenPrice = x.CourseBase.Price,
                    currency = x.CourseBase.Currency,
                    lessonLength = x.CourseBase.TokenMinuteValue
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

            var hasReview = await _db.CourseReviews.Where(x => x.WallId == wallId && x.ReviewerId == userId).AnyAsync(ct);
            var currency = new CurrencyDTO
            {
                Id = walldata.currency.Id,
                CurrencyCode = walldata.currency.CurrencyCode,
                CurrencySymbol = walldata.currency.CurrencySymbol,
                Name = walldata.currency.Name,
            };

            return ServiceResult<StudentTutoringWallDTO>.Success(new StudentTutoringWallDTO
            {
                CourseName = walldata.courseName,
                TeacherId = walldata.teacherId,
                TeacherName = walldata.teacherName,
                BannerURL = walldata.bannerURL,
                CourseBaseId = walldata.courseBaseId,
                IconURL = walldata.iconURL,
                InstanceId = wallId,
                NextHandins = nextHandins,
                NextLessons = nextLessons,
                TokenCount = walldata.tokens,
                WroteReview = hasReview,
                Currency = currency,
                LessonLength = walldata.lessonLength,
                TokenPrice = walldata.tokenPrice,
            });
        }

        public async Task<ServiceResult<StudentInvoicesPageDTO>> GetInvoicesPage(string userId, CancellationToken ct)
        {
            var now = DateTime.UtcNow;
            var monthStart = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
            var monthEnd = monthStart.AddMonths(1);
            var yearStart = new DateTime(now.Year, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            var yearEnd = monthStart.AddYears(1);

            var allInvoices = await _paymentService.GetUserInvoices(userId, ct);
            var invoices = allInvoices.Data.OrderByDescending(x => x.CreatedAt).ToList();

            var successfulInvoices = invoices.Where(x => x.Status == PaymentStatus.Accepted).ToList();
            var totalSpending = successfulInvoices.Sum(x => x.PaidPrice);
            var totalMonthSpending = successfulInvoices.Where(x => monthStart <= x.CreatedAt && x.CreatedAt < monthEnd).Sum(x => x.PaidPrice);
            var totalYearSpending = successfulInvoices.Where(x => yearStart <= x.CreatedAt && x.CreatedAt < yearEnd).Sum(x => x.PaidPrice);

            return ServiceResult<StudentInvoicesPageDTO>.Success(new StudentInvoicesPageDTO
            {
                Invoices = invoices,
                TotalSpending = totalSpending,
                MonthSpending = totalMonthSpending,
                YearSpending = totalYearSpending,
            });
        }

        private static CourseCardUpcomingEventsDTO MapToCourseCardUpcomingEventDTO(Event e)
        {
            return new CourseCardUpcomingEventsDTO
            {
                EventId = e.Id,
                Title = e.Title ?? "",
                StartTime = TimeOnly.FromDateTime(e.StartTime),
                StartDate = DateOnly.FromDateTime(e.StartTime),
                EventType = e.Type,
                Description = e.Description ?? "",
                InstanceId =
                    e.Type == EventType.Lesson ? (e.TutoringWallId ?? Guid.Empty) :
                    e.Type == EventType.Consultation ? (e.PathEnrollmentId ?? Guid.Empty) :
                    e.Type == EventType.Deadline ? (e.TutoringWallId ?? Guid.Empty) :
                    Guid.Empty,
            };
        }

        private int CalculateCourseProgress(PathEnrollment e)
        {
            if (e.Course == null) return 0;
            var totalLessons = _db.LearningPathUnits.Where(x => x.CourseId == e.CourseId).Select(x => x.Lessons).Count();
            if (totalLessons == 0) return 0;
            var completedLessons = e.LastLessonId;
            return 0;
        }

    }
}
