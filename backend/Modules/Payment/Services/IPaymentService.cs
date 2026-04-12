using backend.Modules.Payment.DTOs;
using backend.Modules.Payment.Models;
using backend.Modules.Shared.Results;

namespace backend.Modules.Payment.Services
{
    public interface IPaymentService
    {
        Task<ServiceResult<List<InvoiceDTO>>> GetTeacherInvoices(string userId, CancellationToken ct = default);
        Task<ServiceResult<Guid>> CreatePayment(string userId, PaymentDTO dto, CancellationToken ct);
        Task<ServiceResult> ReactToPayment(PaymentReactionDTO dto, CancellationToken ct);

    }
}
