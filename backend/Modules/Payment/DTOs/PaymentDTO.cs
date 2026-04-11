using backend.Modules.CoursesBase.Models;

namespace backend.Modules.Payment.DTOs
{
    public class PaymentDTO
    {
        public required int TokenCount { get; set; }
        public required Guid InstanceId { get; set; }
        public required Guid CourseBaseId { get; set; }
        public required decimal PaidPrice { get; set; } = decimal.Zero;
    }
}
