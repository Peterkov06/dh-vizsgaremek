using backend.Modules.Shared.DTOs;
using backend.Modules.Shared.Results;

namespace backend.Modules.CoursesBase.Services
{
    public interface ICourseMetadataService
    {
        Task<ServiceResult<List<LookUpDTO>>> GetAllTags();
        Task<ServiceResult> CreateTag(LookUpDTO tag, CancellationToken ct);
        Task<ServiceResult> CreateMultipleTags(List<LookUpDTO> tags, CancellationToken ct);
        Task<ServiceResult> DeleteTag(Guid id);

        Task<ServiceResult<List<LookUpDTO>>> GetAllDomains();
        Task<ServiceResult> CreateDomain(LookUpDTO domain, CancellationToken ct);
        Task<ServiceResult> DeleteDomain(Guid id);

        Task<ServiceResult<List<LookUpDTO>>> GetAllLevels();
        Task<ServiceResult> CreateLevel(LookUpDTO level, CancellationToken ct);
        Task<ServiceResult> DeleteLevels(Guid id);

    }
}
