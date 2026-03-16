using backend.Data;
using backend.Modules.CoursesBase.Models;
using backend.Modules.Homepage.DTOs.Shared;
using backend.Modules.Homepage.DTOs.Student;
using backend.Modules.Progression.Models;
using backend.Modules.Scheduling.Models;
using backend.Shared.Results;
using Microsoft.EntityFrameworkCore;

namespace backend.Modules.Homepage.Services
{
    public class HomePageService : IHomePageService
    {
        private readonly AppDbContext _db;
        public HomePageService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<ServiceResult<StudentHomePageDTO>> GetStudentHomePageAsync(string userId)
        {
            var attendedTutoringCoursesTask = _db.TutoringWalls.Where(x => x.StudentId == userId).Include(x => x.CourseBase).ThenInclude(x => x.Teacher).ToListAsync();
            var attendedPathCoursesTask = _db.PathEnrollments.Where(x => x.AttendantId == userId).Include(x => x.Course).ThenInclude(x => x.Teacher).ToListAsync();
            var upcomingEventsTask = _db.Events.Where(x => (x.Enrollment != null && x.Enrollment.AttendantId == userId) || (x.TutoringWall != null && x.TutoringWall.StudentId == userId)).Where(x => x.StartTime > DateTime.UtcNow).OrderBy(x => x.StartTime).Take(5).Include(x => x.PathCourse).Include(x => x.TutoringWall).ThenInclude(x => x.CourseBase).ToListAsync();
            var notificationTask = _db.Notifications.Where(x => x.RecipientId == userId && !x.IsRead).OrderByDescending(x => x.CreatedAt).Take(1).ToListAsync();
            var popularCoursesTask = _db.CourseBases.Where(x => x.Status == CourseStatus.Active).Include(x => x.Teacher).ThenInclude(x => x.User).Include(x => x.Currency).OrderByDescending(x => x.CreatedAt).Take(10).ToListAsync();

            await Task.WhenAll(attendedPathCoursesTask, attendedTutoringCoursesTask, upcomingEventsTask, notificationTask, popularCoursesTask);

            var walls = await attendedTutoringCoursesTask;
            var paths = await attendedPathCoursesTask;
            var upcomingEvents = await upcomingEventsTask;
            var notifications = await notificationTask;
            var popularCourses = await popularCoursesTask;

            var activeWalls = walls.Where(x => x.Status == Shared.Models.EnrollmentStatus.Active).Select(x => new AttendedCourseDTO
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
            
            var activePaths= paths.Where(x => x.Status == Shared.Models.EnrollmentStatus.Active).Select(x => new AttendedCourseDTO
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

            var inactiveWalls = walls.Where(x => x.Status != Shared.Models.EnrollmentStatus.Inactive).Select(x => new AttendedCourseDTO
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

            var inactivePaths= paths.Where(x => x.Status != Shared.Models.EnrollmentStatus.Inactive).Select(x => new AttendedCourseDTO
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
                    LastUnread = null,
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
                    }
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
