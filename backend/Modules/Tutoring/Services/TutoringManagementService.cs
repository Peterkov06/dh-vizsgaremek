using backend.Data;
using backend.Modules.CoursesBase.Models;
using backend.Modules.Engagement.Models;
using backend.Modules.Engagement.Services;
using backend.Modules.Identity.Models;
using backend.Modules.Shared.Models;
using backend.Modules.Shared.Results;
using backend.Modules.Tutoring.DTOs;
using backend.Modules.Tutoring.Models;
using Microsoft.EntityFrameworkCore;
using System.Net.WebSockets;

namespace backend.Modules.Tutoring.Services
{
    public class TutoringManagementService : ITutoringManagementService
    {
        private readonly AppDbContext _db;
        private readonly INotificationService _notificationService;

        public TutoringManagementService(AppDbContext db, INotificationService notificationService)
        {
            _db = db;
            _notificationService = notificationService;
        }

        public async Task<ServiceResult<TutoringWallEnrollmentDTO>> ApplyToCourse(TutoringWallEnrollmentDTO enrollmentDTO, string userId, CancellationToken ct)
        {
            var exists = await _db.TutoringWalls.Where(x => x.CourseId == enrollmentDTO.CourseId).AnyAsync(x => x.StudentId == userId, ct);
            var isTutoring = await _db.CourseBases.Where(x => x.Id == enrollmentDTO.CourseId).AnyAsync(x => x.Type == CourseType.Tutoring, ct);
            if (exists)
            {
                return ServiceResult<TutoringWallEnrollmentDTO>.Failure("Application already exists");
            }
            else if (!isTutoring)
            {
                return ServiceResult<TutoringWallEnrollmentDTO>.Failure("The course is not Tutoring");
            }

            var course = _db.CourseBases.Where(x => x.Id == enrollmentDTO.CourseId).AsNoTracking().FirstOrDefault();


            if (course is null)
            {
                return ServiceResult<TutoringWallEnrollmentDTO>.NotFound("Course does not exist");
            }

            var newEnrollment = new TutoringWall { CourseId =  enrollmentDTO.CourseId, Status = enrollmentDTO.Status, StudentId = userId, TokenCount = enrollmentDTO.TokenCount, TeacherId = course.TeacherId };

            _db.TutoringWalls.Add(newEnrollment);

            await _notificationService.NotifyAsync(course.TeacherId, NotificationType.PendingEnrollment, enrollmentDTO.CourseId, userId,course.CourseName);

            await _db.SaveChangesAsync(ct);
            enrollmentDTO.Id = newEnrollment.Id;

            return ServiceResult<TutoringWallEnrollmentDTO>.Success(enrollmentDTO);
        }

        public async Task<ServiceResult<string>> RespondToApplication(EnrollmentResponseDTO responseDTO, string teacherId, CancellationToken ct)
        {
            var tutoringWall = await _db.TutoringWalls.Include(x => x.CourseBase).ThenInclude(x => x.Teacher).FirstOrDefaultAsync(x => x.Id == responseDTO.EnrollmentID && x.CourseBase.TeacherId == teacherId, ct);
            
            if(tutoringWall == null)
            {
                return ServiceResult<string>.NotFound("Couldn't find such application");
            }

            switch (responseDTO.Accepted)
            {
                case true:
                    tutoringWall.Status = EnrollmentStatus.Active;
                    break;
                case false:
                    tutoringWall.Status = EnrollmentStatus.Rejected; 
                    break;
            }

            _db.TutoringWalls.Update(tutoringWall);

            await _notificationService.NotifyAsync(tutoringWall.StudentId, responseDTO.Accepted ? NotificationType.EnrollmentAcceptance : NotificationType.EnrollmentRefusal, tutoringWall.Id, teacherId, tutoringWall.CourseBase.CourseName);

            await _notificationService.ClearReactedNotification(tutoringWall.StudentId, teacherId, NotificationType.PendingEnrollment, ct);

            await _db.SaveChangesAsync(ct);

            return ServiceResult<string>.Success(tutoringWall.StudentId);
        }
        public async Task<ServiceResult<List<TutoringWallEnrollmentTeacherDTO>>> GetTeacherEnrollments(string teacherId, CancellationToken ct)
        {
            var enrollments = await _db.TutoringWalls.Where(x => x.CourseBase.TeacherId == teacherId && x.Status == EnrollmentStatus.Pending).Select(x => new TutoringWallEnrollmentTeacherDTO { CourseId = x.CourseId, StudentId = x.StudentId, Id = x.Id, StudentName = x.Student.User.FullName, CourseName = x.CourseBase.CourseName, ProfilePictureURL = x.Student.User.ProfilePicture.StoragePath}).AsNoTracking().ToListAsync(ct);
            return ServiceResult<List<TutoringWallEnrollmentTeacherDTO>>.Success(enrollments);
        }
    }
}
