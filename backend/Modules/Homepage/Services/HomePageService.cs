using backend.Data;
using backend.Modules.CoursesBase.Models;
using backend.Modules.Homepage.DTOs.Shared;
using backend.Modules.Homepage.DTOs.Student;
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
                ImageUrl = "",
                //UpcomingEvents = upcomingEvents.Where(y => y.TutoringWallId == x.Id).ToList()
            });
        }
    }
}
