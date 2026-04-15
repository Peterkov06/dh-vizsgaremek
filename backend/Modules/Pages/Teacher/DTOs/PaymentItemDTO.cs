namespace backend.Modules.Pages.Teacher.DTOs
{
    public class PaymentItemDTO
    {
        public Guid CourseId { get; set; }
        public Guid InstanceId { get; set; }
        public string CourseName { get; set; } = "";
        public string UserId { get; set; } = "";
        public string UserName { get; set; } = "";
        public string? ProfilePictureUrl { get; set; } = null;
        public decimal PaymentValue { get; set; }
        public string PaymentCurrency { get; set; } = "";
        public int TokenCount { get; set; }
        public DateTime PaymentDate { get; set; }
        public Guid InvoiceId { get; set; }
    }
}
