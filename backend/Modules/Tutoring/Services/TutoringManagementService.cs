using backend.Data;
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

        public TutoringManagementService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<ServiceResult<TutoringWallEnrollmentDTO>> ApplyToCourse(TutoringWallEnrollmentDTO enrollmentDTO, string userId, CancellationToken ct)
        {
            var exists = await _db.TutoringWalls.Where(x => x.CourseId == enrollmentDTO.CourseId).AnyAsync(x => x.StudentId == userId, ct);
            if (exists)
            {
                return ServiceResult<TutoringWallEnrollmentDTO>.Failure("Application already exists");
            }

            var teacherId = _db.CourseBases.Where(x => x.Id == enrollmentDTO.CourseId).Select(x => x.TeacherId).FirstOrDefault();

            if (teacherId is null)
            {
                return ServiceResult<TutoringWallEnrollmentDTO>.NotFound("Course does not exist");
            }

            var newEnrollment = new TutoringWall { CourseId =  enrollmentDTO.CourseId, Status = enrollmentDTO.Status, StudentId = userId, TokenCount = enrollmentDTO.TokenCount, TeacherId = teacherId };

            _db.TutoringWalls.Add(newEnrollment);

            await _db.SaveChangesAsync(ct);
            enrollmentDTO.Id = newEnrollment.Id;

            return ServiceResult<TutoringWallEnrollmentDTO>.Success(enrollmentDTO);
        }

        public async Task<ServiceResult> RespondToApplication(EnrollmentResponseDTO responseDTO, string teacherId, CancellationToken ct)
        {
            var tutoringWall = await _db.TutoringWalls.Include(x => x.CourseBase).ThenInclude(x => x.Teacher).FirstOrDefaultAsync(x => x.Id == responseDTO.EnrollmentID && x.CourseBase.TeacherId == teacherId, ct);
            
            if(tutoringWall == null)
            {
                return ServiceResult.NotFound("Couldn't find such application");
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
            await _db.SaveChangesAsync(ct);

            return ServiceResult.Success();
        }
        public async Task<ServiceResult<List<TutoringWallEnrollmentTeacherDTO>>> GetTeacherEnrollments(string teacherId, CancellationToken ct)
        {
            var enrollments = await _db.TutoringWalls.Include(x => x.CourseBase).Include(x => x.Student).ThenInclude(x => x.User).Where(x => x.CourseBase.TeacherId == teacherId && x.Status == EnrollmentStatus.Pending).Select(x => new TutoringWallEnrollmentTeacherDTO { CourseId = x.CourseId, StudentId = x.StudentId, Id = x.Id, StudentName = x.Student.User.FullName, CourseName = x.CourseBase.CourseName}).ToListAsync(ct);
            return ServiceResult<List<TutoringWallEnrollmentTeacherDTO>>.Success(enrollments);
        }
    }
}
