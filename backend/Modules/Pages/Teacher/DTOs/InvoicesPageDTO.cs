using backend.Modules.Payment.DTOs;

namespace backend.Modules.Pages.Teacher.DTOs
{
    public class InvoicesPageDTO
    {
        public decimal TotalIncome { get; set; }
        public decimal MonthIncome { get; set; }
        public decimal YearIncome { get; set; }
        public required List<InvoiceDTO> PendingInvoices { get; set; }
        public required List<InvoiceDTO> CompletedInvoices { get; set; }
    }
}
