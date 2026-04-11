using backend.Data;
using backend.Modules.CoursesBase.Models;
using backend.Modules.Pages.Student.DTOs;
using backend.Modules.Progression.Models;
using backend.Modules.Scheduling.Models;
using backend.Modules.Shared.Results;
using backend.Modules.Shared.Models;
using backend.Modules.Pages.Shared.DTOs;
using Microsoft.EntityFrameworkCore;
using backend.Modules.Shared.DTOs;

namespace backend.Modules.Pages.Student.Services
{
    public class StudentPageService : IStudentPageService
    {
        private readonly AppDbContext _db;
        public StudentPageService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<ServiceResult<StudentHomePageDTO>> GetStudentHomePageAsync(string userId, CancellationToken ct)
        {
            var walls = await _db.TutoringWalls.Where(x => x.StudentId == userId).Include(x => x.CourseBase).ThenInclude(x => x.Teacher).ThenInclude(x => x.User).OrderBy(x => x.UpdatedAt).AsNoTracking().ToListAsync(ct);
            var paths = await _db.PathEnrollments.Where(x => x.AttendantId == userId).Include(x => x.Course).ThenInclude(x => x.Teacher).ThenInclude(x => x.User).OrderBy(x => x.UpdatedAt).AsNoTracking().ToListAsync(ct);
            var upcomingEvents = await _db.Events
                .Include(x => x.TutoringWall).ThenInclude(x => x.CourseBase).Include(x => x.Enrollment)
                .Where(x => (x.Enrollment != null && x.Enrollment.AttendantId == userId) || (x.TutoringWall != null && x.TutoringWall.StudentId == userId)).Where(x => x.StartTime > DateTime.UtcNow)
                .OrderBy(x => x.StartTime)
                .Include(x => x.CourseBase).AsNoTracking().ToListAsync(ct);
            var notifications = await _db.Notifications
                .Where(x => x.RecipientId == userId && !x.IsRead)
                .OrderByDescending(x => x.CreatedAt).AsNoTracking().ToListAsync(ct);
            var popularCourses = await _db.CourseBases.Where(x => x.Status == CourseStatus.Active).Include(x => x.Teacher).ThenInclude(x => x.User).Include(x => x.Currency).OrderByDescending(x => x.CreatedAt).Take(10).AsNoTracking().ToListAsync(ct);


            var activeWalls = walls.Where(x => x.Status == EnrollmentStatus.Active).Select(x => new AttendedCourseDTO
            {
                CourseId = x.CourseId,
                InstanceId = x.Id,
                CourseName = x.CourseBase?.CourseName ?? "",
                TeacherName = x.CourseBase?.Teacher?.User?.FullName ?? "",
                CourseType = "tutoring",
                Progress = 5,
                ImageUrl = x.CourseBase?.BannerImageId.ToString() ?? "",
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
                ImageUrl = x.Course?.BannerImageId.ToString() ?? "",
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
                ImageUrl = x.CourseBase?.BannerImageId.ToString() ?? "",
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
                ImageUrl = x.Course?.BannerImageId.ToString() ?? "",
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
                    ImageUrl = "",
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
            var attendedTutoringCourses = await _db.TutoringWalls.Where(x => x.StudentId == userId).Include(x => x.CourseBase).ThenInclude(x => x.Teacher).ThenInclude(x => x.User).OrderBy(x => x.UpdatedAt).AsNoTracking().ToListAsync(ct);
            var attendedPathCourses = await _db.PathEnrollments.Where(x => x.AttendantId == userId).Include(x => x.Course).ThenInclude(x => x.Teacher).OrderBy(x => x.UpdatedAt).AsNoTracking().ToListAsync(ct);


            var courses = attendedTutoringCourses
                .OrderBy(x => x.CreatedAt)
                .Select(x => new StudentMyCourseDTO
                {
                    CourseBaseId = x.CourseBase?.Id ?? Guid.Empty,
                    InstanceId = x.Id,
                    CourseName = x.CourseBase.CourseName ?? string.Empty,
                    TeacherName = x.CourseBase?.Teacher?.User?.FullName ?? "",
                    TeacherId = x.CourseBase?.TeacherId ?? "",
                    CourseIconURL = "",
                    CourseBannerURL = x.CourseBase?.BannerImageId.ToString() ?? "",
                    Status = x.Status
                }).ToList();
            courses.AddRange(attendedPathCourses.OrderBy(x => x.CreatedAt).Select(x => new StudentMyCourseDTO
            {
                CourseBaseId = x.Course?.Id ?? Guid.Empty,
                InstanceId = x.Id,
                CourseName = x.Course.CourseName ?? string.Empty,
                TeacherName = x.Course?.Teacher?.User?.FullName ?? "",
                TeacherId = x.Course?.TeacherId ?? "",
                CourseIconURL = "",
                CourseBannerURL = x.Course?.BannerImageId.ToString() ?? "",
                Status = x.Status
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
                    bannerURL = x.CourseBase.BannerImage.StoragePath ?? "",
                    iconURL = x.CourseBase.IconImage.StoragePath ?? "",
                })
                .SingleOrDefaultAsync(ct);

            var nextHandins = await _db.Events
                .Where(x => x.TutoringWallId == wallId && x.StartTime > DateTime.UtcNow && x.Type == EventType.Deadline)
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
                .Where(x => x.TutoringWallId == wallId && x.StartTime > DateTime.UtcNow && x.Type == EventType.Lesson)
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
                TokenCount = 0
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
