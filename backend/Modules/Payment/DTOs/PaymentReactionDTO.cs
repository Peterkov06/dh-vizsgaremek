namespace backend.Modules.Payment.DTOs
{
    public class PaymentReactionDTO
    {
        public Guid InvoiceId { get; set; }
        public bool Accepted { get; set; }
    }
}
