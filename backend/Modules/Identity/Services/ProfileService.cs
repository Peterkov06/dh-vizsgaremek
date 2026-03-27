using backend.Data;
using backend.Modules.Identity.DTOs;
using backend.Modules.Shared.Results;
using Microsoft.EntityFrameworkCore;

namespace backend.Modules.Identity.Services
{
    public class ProfileService : IProfileService
    {
        private readonly AppDbContext _db;

        public Task<ServiceResult<StudentProfileDTO>> GetStudentProfile(string userId, CancellationToken ct)
        {
            throw new NotImplementedException();
        }

        public async Task<ServiceResult<TeacherProfileDTO>> GetTeacherProfile(string userId, CancellationToken ct)
        {
            var user = await _db.Teachers
                .Include(x => x.User).ThenInclude(x => x.ProfilePicture)
                .FirstOrDefaultAsync(x => x.TeacherId == userId, ct);
            if (user == null)
            {
                return ServiceResult<TeacherProfileDTO>.NotFound("Teacher not found");
            }

            var totalStudents = await _db.TutoringWalls
                .Include(x => x.CourseBase)
                .Where(x => x.CourseBase.TeacherId == userId).Select(x => x.StudentId)
                .Union(
                    _db.PathEnrollments
                        .Include(x => x.Course)
                        .Where(x => x.Course.TeacherId == userId)
                        .Select(x => x.AttendantId)
                ).CountAsync(ct);
            var courseReviews = await _db.CourseReviews
                .Include(x => x.Course)
                .Where(x => x.Course.TeacherId == userId)
                .AverageAsync(x => (float?)x.ReviewScore, ct) ?? 0f;

            var totalCourses = await _db.CourseBases.CountAsync(x => x.TeacherId == userId, ct);

            var profile = new TeacherProfileDTO
            {
                Id = userId,
                FullName = user.User.FullName ?? string.Empty,
                Introduction = user.User.Introduction ?? string.Empty,
                ProfilePictureUrl = "",
                RatingAverage = courseReviews,
                TotalCourses = totalCourses,
                TotalStudents = totalStudents,
            };

            return ServiceResult<TeacherProfileDTO>.Success(profile);
        }
    }
}
