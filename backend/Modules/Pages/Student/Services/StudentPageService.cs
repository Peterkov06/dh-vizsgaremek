using backend.Data;
using backend.Modules.CoursesBase.Models;
using backend.Modules.Pages.Student.DTOs;
using backend.Modules.Progression.Models;
using backend.Modules.Scheduling.Models;
using backend.Modules.Shared.Results;
using backend.Modules.Shared.Models;
using backend.Modules.Pages.Shared.DTOs;
using Microsoft.EntityFrameworkCore;

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
            var walls = await _db.TutoringWalls.Where(x => x.StudentId == userId).Include(x => x.CourseBase).ThenInclude(x => x.Teacher).ThenInclude(x => x.User).ToListAsync(ct);
            var paths = await _db.PathEnrollments.Where(x => x.AttendantId == userId).Include(x => x.Course).ThenInclude(x => x.Teacher).ThenInclude(x => x.User).ToListAsync(ct);
            var upcomingEvents = await _db.Events
                .Include(x => x.TutoringWall).ThenInclude(x => x.CourseBase).Include(x => x.Enrollment)
                .Where(x => (x.Enrollment != null && x.Enrollment.AttendantId == userId) || (x.TutoringWall != null && x.TutoringWall.StudentId == userId)).Where(x => x.StartTime > DateTime.UtcNow)
                .OrderBy(x => x.StartTime).Take(5)
                .Include(x => x.PathCourse).ToListAsync(ct);
            var notifications = await _db.Notifications
                .Where(x => x.RecipientId == userId && !x.IsRead)
                .OrderByDescending(x => x.CreatedAt).ToListAsync(ct);
            var popularCourses = await _db.CourseBases.Where(x => x.Status == CourseStatus.Active).Include(x => x.Teacher).ThenInclude(x => x.User).Include(x => x.Currency).OrderByDescending(x => x.CreatedAt).Take(10).ToListAsync(ct);


            var activeWalls = walls.Where(x => x.Status == EnrollmentStatus.Active).Select(x => new AttendedCourseDTO
            {
                CourseId = x.CourseId,
                InstanceId = x.Id,
                CourseName = x.CourseBase?.CourseName ?? "",
                TeacherName = x.CourseBase?.Teacher?.User?.FullName ?? "",
                CourseType = "tutoring",
                Progress = 5,
                ImageUrl = x.CourseBase?.BannerImageId.ToString() ?? "",
                UpcomingEvents = [.. upcomingEvents.Where(y => y.TutoringWallId == x.Id).Select(MapToCourseCardUpcomingEventDTO)]
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
                UpcomingEvents = [.. upcomingEvents.Where(y => y.PathCourseId == x.CourseId).Select(MapToCourseCardUpcomingEventDTO)]
            }).ToList();

            var inactiveWalls = walls.Where(x => x.Status != EnrollmentStatus.Active).Select(x => new AttendedCourseDTO
            {
                CourseId = x.CourseId,
                InstanceId = x.Id,
                CourseName = x.CourseBase?.CourseName ?? "",
                TeacherName = x.CourseBase?.Teacher?.User?.FullName ?? "",
                CourseType = "tutoring",
                Progress = 5,
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
                    LastUnread = lastNotification is not null ? new LastUnreadNotificationDTO { FirstText = lastNotification.Type.ToString(), NotificationId = lastNotification.Id, ReferenceId = lastNotification.ReferenceId, SecondText = "" } : null,
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

        public async Task<ServiceResult<List<StudentMyCourseDTO>>> GetStudentMyCoursesPageAsync(string userId, CancellationToken ct)
        {
            var attendedTutoringCourses = await _db.TutoringWalls.Where(x => x.StudentId == userId).Include(x => x.CourseBase).ThenInclude(x => x.Teacher).ThenInclude(x => x.User).ToListAsync(ct);
            var attendedPathCourses = await _db.PathEnrollments.Where(x => x.AttendantId == userId).Include(x => x.Course).ThenInclude(x => x.Teacher).ToListAsync(ct);


            var courses = attendedTutoringCourses.Select(x => new StudentMyCourseDTO
            {
                CourseBaseId = x.CourseBase?.Id ?? Guid.Empty,
                InstanceId = x.Id,
                TeacherName = x.CourseBase?.Teacher?.User?.FullName ?? "",
                TeacherId = x.CourseBase?.TeacherId ?? "",
                TeacherProfilePictureURL = "",
                CourseBannerURL = x.CourseBase?.BannerImageId.ToString() ?? "",
                Status = x.Status
            }).ToList();
            courses.AddRange(attendedPathCourses.Select(x => new StudentMyCourseDTO
            {
                CourseBaseId = x.Course?.Id ?? Guid.Empty,
                InstanceId = x.Id,
                TeacherName = x.Course?.Teacher?.User?.FullName ?? "",
                TeacherId = x.Course?.TeacherId ?? "",
                TeacherProfilePictureURL = "",
                CourseBannerURL = x.Course?.BannerImageId.ToString() ?? "",
                Status = x.Status
            }));
            return ServiceResult<List<StudentMyCourseDTO>>.Success(courses);
        }

        private static CourseCardUprocmingEventsDTO MapToCourseCardUpcomingEventDTO(Event e)
        {
            return new CourseCardUprocmingEventsDTO
            {
                EventId = e.Id,
                Title = e.Title,
                StartTime = TimeOnly.FromDateTime(e.StartTime),
                StartDate = DateOnly.FromDateTime(e.StartTime),
                EventType = e.Type.ToString(),
                Description = e.Description ?? "",
                EventUrl = e.Type switch
                {
                    EventType.Lesson => $"#",
                    EventType.Deadline => $"#",
                    _ => "#"
                }
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
