using backend.Modules.Shared.DTOs;
using backend.Modules.Shared.Results;

namespace backend.Modules.CoursesBase.Services
{
    public interface ICourseMetadataService
    {
        Task<ServiceResult<List<LookUpDTO>>> GetAllTagsAsync(string? keyWord = null, CancellationToken ct = default);
        Task<ServiceResult<List<LookUpDTO>>> GetCourseTags(Guid courseId, CancellationToken ct);
        Task<ServiceResult<LookUpDTO>> CreateTagAsync(LookUpDTO tag, CancellationToken ct);
        Task<ServiceResult<List<Guid>>> CreateOrGetTagsAsync(List<string> tags, CancellationToken ct);
        Task<ServiceResult> DeleteTag(Guid id);

        Task<ServiceResult<List<LookUpDTO>>> GetAllDomainsAsync(CancellationToken ct);
        Task<ServiceResult<LookUpDTO>> CreateDomainAsync(LookUpDTO domain, CancellationToken ct);
        Task<ServiceResult> DeleteDomain(Guid id);

        Task<ServiceResult<List<LookUpDTO>>> GetAllLevelsAsync(CancellationToken ct);
        Task<ServiceResult<LookUpDTO>> CreateLevelAsync(LookUpDTO level, CancellationToken ct);
        Task<ServiceResult> DeleteLevels(Guid id);

    }
}
