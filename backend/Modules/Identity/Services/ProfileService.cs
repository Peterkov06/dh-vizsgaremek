using backend.Data;
using backend.Modules.Identity.DTOs;
using backend.Modules.Shared.Results;
using Microsoft.EntityFrameworkCore;

namespace backend.Modules.Identity.Services
{
    public class ProfileService : IProfileService
    {
        private readonly AppDbContext _db;

        public ProfileService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<ServiceResult<StudentProfileDTO>> GetStudentProfile(string userId, CancellationToken ct)
        {
            var user = await _db.Students.Include(x => x.User).ThenInclude(x => x.ProfilePicture).AsNoTracking()
                .FirstOrDefaultAsync(x => x.UserId == userId, ct);
            if (user == null)
            {
                return ServiceResult<StudentProfileDTO>.NotFound("Student not found");
            }

            var age = DateTime.Today.Year - user.User.DateOfBirth.Year;
            if (DateTime.Today.DayOfYear < user.User.DateOfBirth.DayOfYear)
            {
                age = age - 1;
            }

            var profile = new StudentProfileDTO
            {
                Age = age,
                FullName = user.User.FullName,
                Id = userId,
                Introduction = user.User.Introduction ?? "",
                Nickname = user.User.Nickname,
                ProfilePictureUrl = "",
                Type = "Student"
            };
            return ServiceResult<StudentProfileDTO>.Success(profile);
        }

        public async Task<ServiceResult<TeacherProfileDTO>> GetTeacherProfile(string userId, CancellationToken ct)
        {
            var user = await _db.Teachers
                .Include(x => x.User).ThenInclude(x => x.ProfilePicture).AsNoTracking()
                .FirstOrDefaultAsync(x => x.TeacherId == userId, ct);
            if (user == null)
            {
                return ServiceResult<TeacherProfileDTO>.NotFound("Teacher not found");
            }

            var totalStudents = await _db.TutoringWalls
                .Where(x => x.CourseBase.TeacherId == userId).Select(x => x.StudentId)
                .Union(
                    _db.PathEnrollments
                        .Include(x => x.Course)
                        .Where(x => x.Course.TeacherId == userId)
                        .Select(x => x.AttendantId)
                ).CountAsync(ct);
            var courseReviews = await _db.CourseReviews
                .Where(x => x.Course.TeacherId == userId)
                .AverageAsync(x => (float?)x.ReviewScore, ct) ?? 0f;

            var totalCourses = await _db.CourseBases.CountAsync(x => x.TeacherId == userId, ct);
            var age = DateTime.Today.Year - user.User.DateOfBirth.Year;
            if (DateTime.Today.DayOfYear < user.User.DateOfBirth.DayOfYear)
            {
                age = age - 1;
            }

            var profile = new TeacherProfileDTO
            {
                Id = userId,
                FullName = user.User.FullName ?? string.Empty,
                Introduction = user.User.Introduction ?? string.Empty,
                ProfilePictureUrl = "",
                RatingAverage = courseReviews,
                TotalCourses = totalCourses,
                TotalStudents = totalStudents,
                Age = age,
                Type = "Teacher"
            };

            return ServiceResult<TeacherProfileDTO>.Success(profile);
        }
    }
}
