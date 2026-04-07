using backend.Modules.Shared.Results;
using backend.Modules.Tutoring.DTOs;

namespace backend.Modules.Tutoring.Services
{
    public interface ITutoringManagementService
    {
        Task<ServiceResult<TutoringWallEnrollmentDTO>> ApplyToCourse(TutoringWallEnrollmentDTO enrollmentDTO, string userId, CancellationToken ct);
        Task<ServiceResult<string>> RespondToApplication(EnrollmentResponseDTO responseDTO, string teacherId, CancellationToken ct);
        Task<ServiceResult<List<TutoringWallEnrollmentTeacherDTO>>> GetTeacherEnrollments(string teacherId, CancellationToken ct);
    }
}
