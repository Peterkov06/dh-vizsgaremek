namespace backend.Modules.Scheduling.DTOs
{
    public class DailyTimeblocksDTO
    {
        public required DateOnly Day { get; set; }
        public required List<TimeblockWithIdDTO> Timeblocks { get; set; }
    }
}
