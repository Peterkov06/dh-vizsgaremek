namespace backend.Modules.Pages.Teacher.DTOs
{
    public class GradingItemDTO
    {
        public Guid SubmissionId { get; set; }
        public Guid InstanceId { get; set; }
        public string CourseName { get; set; } = "";
        public string HandInTitle { get; set; } = "";
        public string StudentName { get; set; } = "";
        public DateTime SubmittedDate { get; set; } 
        public bool Completed { get; set; } = false;
    }
}
