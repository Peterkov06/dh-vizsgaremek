using backend.Modules.Scheduling.DTOs;
using backend.Modules.Scheduling.Models;
using backend.Modules.Shared.DTOs;
using backend.Modules.Shared.Results;

namespace backend.Modules.Scheduling.Services
{
    public interface ISchedulingService
    {
        Task<ServiceResult> CreateAvailableBlocks(string userId, AvailableTimeblockCreationDTO dto, CancellationToken ct);
        Task<ServiceResult<AvailableDaysDTO>> GetAvailableDays(string teacherId, DateTime searchDate, CancellationToken ct);
        Task<ServiceResult<AvailableTimesDTO>> GetAvailableTimes(string teacherId, Guid courseId, int lessonNum, DateTime searchDate, CancellationToken ct);
        Task<ServiceResult<Event>> BookEvent(string userId, string role, BookingDTO dto, CancellationToken ct);
        Task<ServiceResult<Dictionary<DateOnly, List<TimeblockWithIdDTO>>>> GetCurrentTimeBlocks(string teacherId, DateTime searchDate, CancellationToken ct);
        Task<ServiceResult<Dictionary<DateOnly, List<EventDTO>>>> GetEvents(string userId, DateTime searchDate, SearchTimeLength timeLength, CancellationToken ct);
        Task<ServiceResult> DeleteTimeblock(Guid blockId, CancellationToken ct );
        Task<ServiceResult> DeleteBookedEvent(string userId, string role, Guid eventId, CancellationToken ct);
    }
}
