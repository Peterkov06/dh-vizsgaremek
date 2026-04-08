using backend.Data;
using backend.Models;
using backend.Modules.Engagement.Services;
using backend.Modules.Scheduling.DTOs;
using backend.Modules.Scheduling.Models;
using backend.Modules.Shared.Results;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace backend.Modules.Scheduling.Services
{
    public class SchedulingService: ISchedulingService
    {
        private readonly AppDbContext _db;
        private readonly INotificationService _notificationService;

        public SchedulingService(AppDbContext db, INotificationService notificationService)
        {
            _db = db;
            _notificationService = notificationService;
        }

        public async Task<ServiceResult> CreateAvailableBlock(string userId, AvailableTimeblockCreationDTO dto, CancellationToken ct = default)
        {
            List<TeacherTimeblock> timeblocks = [];
            foreach (var block in timeblocks)
            {
                timeblocks.Add(new TeacherTimeblock { TeacherId = userId, Start = block.Start, End = block.End });
            }

            _db.TeacherTimeblocks.AddRange(timeblocks);
            await _db.SaveChangesAsync(ct);

            return ServiceResult.Success();
        }

        public async Task<ServiceResult<AvailableDaysDTO>> GetAvailableDays(string teacherId, DateTime searchDate, CancellationToken ct = default)
        {
            var firstDayOfMonth = new DateTime(searchDate.Year, searchDate.Month, 1);
            var lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddTicks(-1);

            var availableStarts = await _db.TeacherTimeblocks
                .Where(x => x.TeacherId == teacherId && x.Start <= lastDayOfMonth && x.End >= firstDayOfMonth)
                .AsNoTracking()
                .Select(x => x.Start.Date)
                .Distinct()
                .ToListAsync(ct);

            var availableDays = new AvailableDaysDTO
            {
                AvailableDays = availableStarts.Select(DateOnly.FromDateTime).ToList(),
            };

            return ServiceResult<AvailableDaysDTO>.Success(availableDays);
        }

        public async Task<ServiceResult<AvailableTimesDTO>> GetAvailableTimes(string teacherId, Guid courseId, int lessonNum, DateTime searchDate, EventType type, CancellationToken ct = default)
        {
            List<TimeblockDTO> lessons = []; 
            int? oneLessonLength = _db.CourseBases.Where(x => x.Id == courseId).Select(x => x.TokenMinuteValue).FirstOrDefault();

            if (oneLessonLength is null)
            {
                return ServiceResult<AvailableTimesDTO>.NotFound("Course not found");
            }

            var lessonLength = oneLessonLength * lessonNum;

            var firstTime = new DateTime(searchDate.Year, searchDate.Month, searchDate.Day, 0,0,0);
            var lastTime = firstTime.AddDays(1);

            var originalTimeBlocks = await _db.TeacherTimeblocks.Where( x => x.TeacherId == teacherId && x.Start < lastTime && x.Start >= firstTime && x.End > firstTime && x.End <= lastTime).OrderBy(x => x.Start).AsNoTracking().ToListAsync(ct);
            var bookedLessons = await _db.Events.Where(x => x.OrganiserId == teacherId && x.StartTime >= firstTime && x.StartTime < lastTime).OrderBy(x => x.StartTime).AsNoTracking().ToListAsync(ct);

            List<TimeblockDTO> timeBlocks = [];

            foreach (var og in originalTimeBlocks)
            {
                var lessonsInBlock = bookedLessons.Where(x => x.StartTime < og.End && x.EndTime > og.Start).OrderBy(x => x.StartTime).ToArray();
                var start = og.Start;
                foreach (var lesson in lessonsInBlock)
                {
                    var remainingMins = lesson.StartTime - start;
                    if (remainingMins.TotalMinutes >= lessonLength)
                    {
                        timeBlocks.Add(new TimeblockDTO { Start = start, End = lesson.StartTime });
                    }
                    start = lesson.EndTime;
                }


                if ((og.End - start).TotalMinutes >= lessonLength)
                {
                    timeBlocks.Add(new TimeblockDTO { Start = start, End = og.End });
                }
            }

            foreach (var block in timeBlocks)
            {
                var startTime = block.Start;
                var endTime = startTime.AddMinutes((double)lessonLength);

                while (endTime <= block.End)
                {
                    lessons.Add(new TimeblockDTO() { Start = startTime, End = endTime });
                    startTime = startTime.AddMinutes(10);
                    endTime = startTime.AddMinutes((double)lessonLength);
                }
            }

            return ServiceResult<AvailableTimesDTO>.Success(new AvailableTimesDTO { AvailableTimes = lessons });
        }
    }
}
