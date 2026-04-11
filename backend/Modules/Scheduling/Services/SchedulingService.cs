using backend.Data;
using backend.Models;
using backend.Modules.Engagement.Models;
using backend.Modules.Engagement.Services;
using backend.Modules.Identity.Models;
using backend.Modules.Scheduling.DTOs;
using backend.Modules.Scheduling.Models;
using backend.Modules.Shared.DTOs;
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

        public async Task<ServiceResult> CreateAvailableBlocks(string userId, AvailableTimeblockCreationDTO dto, CancellationToken ct = default)
        {
            var minStart = dto.Timeblocks.Min(x => x.Start);
            var maxEnd = dto.Timeblocks.Max(x => x.End);

            var existingBlocks = await _db.TeacherTimeblocks
                .Where(x => x.TeacherId == userId && x.End > minStart && x.Start < maxEnd)
                .ToListAsync(ct);

            foreach (var newBlock in dto.Timeblocks)
            {
                bool overlaps = existingBlocks.Any(existing =>
                    existing.Start < newBlock.End && existing.End > newBlock.Start);

                if (overlaps)
                {
                    return ServiceResult.Failure($"Overlap detected for block: {newBlock.Start} - {newBlock.End}");
                }
            }

            var timeblocks = dto.Timeblocks.Select(block => new TeacherTimeblock
            {
                TeacherId = userId,
                Start = block.Start,
                End = block.End
            }).ToList();

            _db.TeacherTimeblocks.AddRange(timeblocks);
            int result = await _db.SaveChangesAsync(ct);

            return result > 0
                ? ServiceResult.Success()
                : ServiceResult.Failure("No records were saved to the database.");
        }

        public async Task<ServiceResult<List<DailyTimeblocksDTO>>> GetCurrentTimeBlocks(string teacherId, DateTime searchDate, CancellationToken ct = default)
        {
            int diff = (7 + (searchDate.DayOfWeek - DayOfWeek.Monday)) % 7;
            DateTime startOfWeek = searchDate.AddDays(-1 * diff).Date;
            startOfWeek = DateTime.SpecifyKind(startOfWeek, DateTimeKind.Utc);

            DateTime endOfWeek = startOfWeek.AddDays(7);

            var timeBlocksOfTheWeek = await _db.TeacherTimeblocks
                .Where(x => x.TeacherId == teacherId
                       && x.Start >= startOfWeek
                       && x.Start < endOfWeek)
                .Select(x => new TimeblockWithIdDTO { Start = x.Start, End = x.End, Id = x.Id })
                .OrderBy(x => x.Start)
                .AsNoTracking()
                .ToListAsync(ct);

            var availebleDays = timeBlocksOfTheWeek
                .GroupBy(x => DateOnly.FromDateTime(x.Start.Date))
                .Select(x => new DailyTimeblocksDTO
                {
                    Day = x.Key,
                    Timeblocks = x.ToList()
                }).ToList();

            return ServiceResult<List<DailyTimeblocksDTO>>.Success(availebleDays);
        }

        public async Task<ServiceResult<AvailableDaysDTO>> GetAvailableDays(string teacherId, DateTime searchDate, CancellationToken ct = default)
        {
            var firstDayOfMonth = new DateTime(searchDate.Year, searchDate.Month, 1, 0, 0, 0, DateTimeKind.Utc);
            var lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddTicks(-1);

            var now = DateTime.UtcNow;

            var availableStarts = await _db.TeacherTimeblocks
                .Where(x => x.TeacherId == teacherId && x.Start <= lastDayOfMonth && x.End >= firstDayOfMonth && x.Start >= now)
                .AsNoTracking()
                .Select(x => x.Start.Date)
                .Distinct()
                .OrderBy(x => x)
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

            var firstTime = searchDate.Date;
            var lastTime = firstTime.AddDays(1);

            firstTime = DateTime.SpecifyKind(firstTime, DateTimeKind.Utc);
            lastTime = DateTime.SpecifyKind(lastTime, DateTimeKind.Utc);
            var now = DateTime.UtcNow;

            var originalTimeBlocks = await _db.TeacherTimeblocks.Where( x => x.TeacherId == teacherId && x.Start < lastTime && x.Start >= firstTime && x.End > firstTime && x.End <= lastTime && x.Start >= now).OrderBy(x => x.Start).AsNoTracking().ToListAsync(ct);
            var bookedLessons = await _db.Events.Where(x => x.OrganiserId == teacherId && x.StartTime >= firstTime && x.StartTime < lastTime && x.StartTime >= now).OrderBy(x => x.StartTime).AsNoTracking().ToListAsync(ct);

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

        public async Task<ServiceResult<Event>> BookEvent(string userId, string role, BookingDTO dto, CancellationToken ct = default)
        {
            if (dto.Timeblock.Start.Date != dto.Timeblock.End.Date)
            {
                return ServiceResult<Event>.Failure("Invalid booking time: the start and end should be on the same day");
            }
            if (dto.Timeblock.Start < DateTime.Now) 
            {
                return ServiceResult<Event>.Failure("Invalid booking time: Can't book in the past");
            }

            string? teacherId = null;
            string? studentId = null;
            if (role == "Student")
            {
                studentId = userId;
                switch (dto.Type)
                {
                    case EventType.Lesson or EventType.Deadline:
                        teacherId = await _db.TutoringWalls.Where(x => x.StudentId == userId && x.CourseId == dto.CourseBaseId).Select(x => x.TeacherId).AsNoTracking().FirstOrDefaultAsync(ct);
                        break;
                    case EventType.Consultation:
                        teacherId = await _db.PathEnrollments.Where(x => x.AttendantId == userId && x.CourseId == dto.CourseBaseId).Select(x => x.Course.TeacherId).AsNoTracking().FirstOrDefaultAsync(ct);
                        break;
                    default:
                        return ServiceResult<Event>.Failure("Unrecognised type");
                }
            }
            else if (role == "teacher")
            {
                teacherId = userId;

                switch (dto.Type)
                {
                    case EventType.Lesson or EventType.Deadline:
                        studentId = await _db.TutoringWalls.Where(x => x.TeacherId == userId && x.CourseId == dto.CourseBaseId).Select(x => x.StudentId).AsNoTracking().FirstOrDefaultAsync(ct);
                        break;
                    case EventType.Consultation:
                        studentId = await _db.PathEnrollments.Where(x => x.Course.TeacherId == userId && x.CourseId == dto.CourseBaseId).Select(x => x.AttendantId).AsNoTracking().FirstOrDefaultAsync(ct);
                        break;
                    default:
                        return ServiceResult<Event>.Failure("Unrecognised type");
                }
            }
            if (teacherId is null || studentId is null)
            {
                return ServiceResult<Event>.NotFound("No course was found");
            }

            var withinAvailability = await _db.TeacherTimeblocks.AsNoTracking()
                .AnyAsync(x => x.TeacherId == teacherId
                    && x.Start <= dto.Timeblock.Start
                    && x.End >= dto.Timeblock.End, ct);

            if (!withinAvailability)
                return ServiceResult<Event>.Failure("Time slot is outside teacher availability");

            var conflict = await _db.Events.AsNoTracking()
                .AnyAsync(x => x.OrganiserId == teacherId && x.Type != EventType.Deadline
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
                CourseBaseId = dto.CourseBaseId,
            };

            NotificationType notificationType = NotificationType.NewLesson;
            string courseName = await _db.CourseBases.Where(x => x.Id == dto.CourseBaseId).Select(x => x.CourseName).AsNoTracking().FirstOrDefaultAsync(ct) ?? "";

            switch (dto.Type)
            {
                case EventType.Lesson:
                    newEvent.TutoringWallId = dto.InstanceId;
                    break;
                case EventType.Deadline:
                    newEvent.TutoringWallId = dto.InstanceId;
                    notificationType = NotificationType.NewHandIn;
                    break;
                case EventType.Consultation:
                    newEvent.PathEnrollmentId = dto.InstanceId;
                    notificationType = NotificationType.NewConsultation;
                    break;
                default:
                    return ServiceResult<Event>.Failure("Unrecognised type");
            }

            try
            {
                _db.Events.Add(newEvent);
                switch (role)
                {
                    case "Teacher":
                        await _notificationService.NotifyAsync(studentId, notificationType, dto.InstanceId, teacherId, courseName);
                        break;
                    case "Student":
                        var studentName = await _db.Students.Where(x => x.UserId == studentId).Select(x => x.User.FullName).SingleOrDefaultAsync(ct);
                        if (studentName is null)
                        {
                            return ServiceResult<Event>.NotFound("Student not found");
                        }
                        await _notificationService.NotifyAsync(teacherId, notificationType, dto.InstanceId, studentId, studentName);
                        break;
                    default:
                        break;
                }
                await _db.SaveChangesAsync(ct);
            }
            catch (DbUpdateException)
            {
                return ServiceResult<Event>.Failure("Time slot is no longer available");
            }

            return ServiceResult<Event>.Success(newEvent);
        }

        public async Task<ServiceResult<Dictionary<DateOnly, List<EventDTO>>>> GetEvents(string userId, DateTime searchDate, SearchTimeLength timeLength = SearchTimeLength.Week, CancellationToken ct = default)
        {
            DateTime startOfStreak;
            DateTime endOfStreak;

            switch (timeLength)
            {
                case SearchTimeLength.Day:
                    startOfStreak = searchDate.Date;
                    endOfStreak = startOfStreak.AddDays(1);
                    break;
                default:
                case SearchTimeLength.Week:
                    int diff = (7 + (searchDate.DayOfWeek - DayOfWeek.Monday)) % 7;
                    startOfStreak = searchDate.AddDays(-1 * diff).Date;
                    endOfStreak = startOfStreak.AddDays(7);
                    break;
                case SearchTimeLength.Month:
                    startOfStreak = new DateTime(searchDate.Year, searchDate.Month, 1).Date;
                    endOfStreak = startOfStreak.AddMonths(1);
                    break;
            }

            startOfStreak = DateTime.SpecifyKind(startOfStreak, DateTimeKind.Utc);
            endOfStreak = DateTime.SpecifyKind(endOfStreak, DateTimeKind.Utc);

            var eventsOfTheWeek = await _db.Events
                .Where(x => (x.OrganiserId == userId || x.TutoringWall.StudentId == userId || x.Enrollment.AttendantId == userId)
                       && x.StartTime >= startOfStreak
                       && x.StartTime < endOfStreak)
                .Select(x => new EventDTO { 
                    ParticipantId = x.OrganiserId == userId ? (x.Type == EventType.Consultation ? x.Enrollment.AttendantId : x.TutoringWall.StudentId) : x.OrganiserId,
                    StartDate = DateOnly.FromDateTime(x.StartTime),
                    StartTime = TimeOnly.FromDateTime(x.StartTime),
                    EndTime = TimeOnly.FromDateTime(x.EndTime),
                    CourseName = x.CourseBase.CourseName,
                    Description = x.Description,
                    EventId = x.Id,
                    EventType = x.Type,
                    InstanceId = x.Type == EventType.Consultation ? x.Enrollment.Id : x.TutoringWall.Id,
                    ParticipantName = x.OrganiserId == userId ? (x.Type == EventType.Consultation ? x.Enrollment.Attendant.User.FullName : x.TutoringWall.Student.User.FullName) : x.Organiser.User.FullName,
                    Title = x.Title,
                    LessonLength = (int)(x.EndTime - x.StartTime).TotalMinutes / x.CourseBase.TokenMinuteValue,
                })
                .OrderBy(x => x.StartDate).ThenBy(x => x.StartTime)
                .AsNoTracking()
                .ToListAsync(ct);
               

            var blocksByDay = eventsOfTheWeek
                .GroupBy(x => x.StartDate)
                .ToDictionary(g => g.Key, g => g.ToList());

            return ServiceResult<Dictionary<DateOnly, List<EventDTO>>>.Success(blocksByDay);
        }

        public async Task<ServiceResult> DeleteTimeblock(Guid blockId, CancellationToken ct = default)
        {
            var block = await _db.TeacherTimeblocks.SingleOrDefaultAsync(x => x.Id == blockId, ct);

            if (block == null)
            {
                return ServiceResult.NotFound("Timeblock not found");
            }

            _db.TeacherTimeblocks.Remove(block);
            int result = await _db.SaveChangesAsync(ct);

            return result > 0
                ? ServiceResult.Success()
                : ServiceResult.Failure("No records were deleted from the database.");
        }

        public async Task<ServiceResult> DeleteBookedEvent(string userId, string role, Guid eventId, CancellationToken ct = default)
        {
            var lesson = await _db.Events.Include(x => x.TutoringWall).Include(x => x.Enrollment).SingleOrDefaultAsync(x => x.Id == eventId, ct);

            if (lesson is null)
            {
                return ServiceResult.NotFound("Booked event not found");
            }

            Guid? instanceId = null;
            string teacherId = lesson.OrganiserId;
            string? studentId = null;
            NotificationType notificationType = NotificationType.DeletedLesson;
            string courseName = await _db.CourseBases.Where(x => x.Id == lesson.CourseBaseId).Select(x => x.CourseName).AsNoTracking().FirstOrDefaultAsync(ct) ?? "";

            switch (lesson.Type)
            {
                case EventType.Lesson:
                    studentId = lesson.TutoringWall?.StudentId;
                    instanceId = lesson.TutoringWallId;
                    break;
                case EventType.Consultation:
                    studentId = lesson.Enrollment?.AttendantId;
                    notificationType = NotificationType.DeletedConsultation;
                    instanceId = lesson.PathEnrollmentId;
                    break;
                case EventType.Deadline:
                    studentId = lesson.TutoringWall?.StudentId;
                    notificationType = NotificationType.DeletedHandin;
                    instanceId = lesson.TutoringWallId;
                    break;
                default:
                    break;
            }

            if (studentId is null)
            {
                return ServiceResult.NotFound("Booked event not found");
            }


            _db.Events.Remove(lesson);
            switch (role)
            {
                case "Teacher":
                    await _notificationService.NotifyAsync(studentId, notificationType, instanceId, teacherId, courseName);
                    break;
                case "Student":
                    await _notificationService.NotifyAsync(teacherId, notificationType, instanceId, studentId, courseName);
                    break;
                default:
                    break;
            }

            int result = await _db.SaveChangesAsync(ct);

            return result > 0
                ? ServiceResult.Success()
                : ServiceResult.Failure("No records were deleted from the database.");
        }
    }
}
