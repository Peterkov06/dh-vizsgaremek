using backend.Modules.Payment.DTOs;

namespace backend.Modules.Pages.Student.DTOs
{
    public class StudentInvoicesPageDTO
    {
        public decimal TotalSpending { get; set; }
        public decimal MonthSpending { get; set; }
        public decimal YearSpending { get; set; }
        public required List<InvoiceDTO> Invoices { get; set; }
    }
}
