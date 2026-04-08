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
            foreach (var block in dto.Timeblocks)
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

        public async Task<ServiceResult<AvailableTimesDTO>> GetAvailableTimes(string teacherId, Guid courseId, int lessonNum, DateTime searchDate, CancellationToken ct = default)
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

        public async Task<ServiceResult<Event>> BookLesson(string? studentId, string? teacherId, BookingDTO dto, CancellationToken ct = default)
        {
            if (teacherId is null && studentId is not null)
            {
                switch (dto.Type)
                {
                    case EventType.Lesson or EventType.Deadline:
                        teacherId = await _db.TutoringWalls.Where(x => x.StudentId == studentId && x.CourseId == dto.CourseBaseId).Select(x => x.TeacherId).AsNoTracking().FirstOrDefaultAsync(ct);
                        break;
                    case EventType.Consultation:
                        teacherId = await _db.PathEnrollments.Where(x => x.AttendantId == studentId && x.CourseId == dto.CourseBaseId).Select(x => x.Course.TeacherId).AsNoTracking().FirstOrDefaultAsync(ct);
                        break;
                    default:
                        return ServiceResult<Event>.Failure("Unrecognised type");
                }
            }
            if (teacherId is null)
            {
                return ServiceResult<Event>.NotFound("No course was found");
            }

            var withinAvailability = await _db.TeacherTimeblocks
                .AnyAsync(x => x.TeacherId == teacherId
                    && x.Start <= dto.Timeblock.Start
                    && x.End >= dto.Timeblock.End, ct);

            if (!withinAvailability)
                return ServiceResult<Event>.Failure("Time slot is outside teacher availability");

            var conflict = await _db.Events
                .AnyAsync(x => x.OrganiserId == teacherId
                    && x.StartTime < dto.Timeblock.End
                    && x.EndTime > dto.Timeblock.Start, ct);

            if (conflict)
                return ServiceResult<Event>.Failure("Time slot is no longer available");

            var newEvent = new Event
            {
                StartTime = dto.Timeblock.Start,
                EndTime = dto.Timeblock.End,
                Type = dto.Type,
                Description = dto.Description,
                Title = dto.Title,
                OrganiserId = teacherId,
            };

            switch (dto.Type)
            {
                case EventType.Lesson or EventType.Deadline:
                    newEvent.TutoringWallId = dto.InstanceId;
                    break;
                case EventType.Consultation:
                    newEvent.PathEnrollmentId = dto.InstanceId;
                    break;
                default:
                    return ServiceResult<Event>.Failure("Unrecognised type");
            }

            try
            {
                _db.Events.Add(newEvent);
                await _db.SaveChangesAsync(ct);
            }
            catch (DbUpdateException)
            {
                return ServiceResult<Event>.Failure("Time slot is no longer available");
            }

            return ServiceResult<Event>.Success(newEvent);
        }
    }
}
