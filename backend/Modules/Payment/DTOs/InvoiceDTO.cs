using backend.Modules.Payment.Models;
using backend.Modules.Shared.Models;

namespace backend.Modules.Payment.DTOs
{
    public class InvoiceDTO
    {
        public required Guid InvoiceId { get; set; }
        public required int TokenCount { get; set; }
        public required Guid InstanceId { get; set; }
        public required string CourseName { get; set; }
        public PaymentStatus Status { get; set; }
        public decimal PaidPrice { get; set; }
        public decimal OneTokenPrice { get; set; }
        public required Currency Currency { get; set; }
        public required string UserId { get; set; }
        public required string UserName { get; set; }
        public string? UserImageURL { get; set; } = null;
        public required DateTime CreatedAt { get; set; }
    }
}
