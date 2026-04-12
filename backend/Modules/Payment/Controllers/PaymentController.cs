using backend.Models;
using backend.Modules.Payment.DTOs;
using backend.Modules.Payment.Services;
using backend.Modules.Scheduling.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Modules.Payment.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/payment")]
    public class PaymentController: ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IPaymentService _paymentService;

        public PaymentController(UserManager<ApplicationUser> userManager, IPaymentService paymentService)
        {
            _userManager = userManager;
            _paymentService = paymentService;
        }

        [Authorize(Roles = "Student")]
        [HttpPost]
        public async Task<IActionResult> CreateInvoice([FromBody] PaymentDTO dto, CancellationToken ct)
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
            {
                return NotFound();
            }

            var res = await _paymentService.CreatePayment(user.Id, dto, ct);
            return res.Succeded ? Created() : StatusCode(res.StatusCode, res.Error);
        }

        [Authorize(Roles = "Teacher")]
        [HttpPatch("react")]
        public async Task<IActionResult> ReactTopInvoice([FromBody] PaymentReactionDTO dto, CancellationToken ct)
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
            {
                return NotFound();
            }

            var res = await _paymentService.ReactToPayment(dto, ct);
            return res.Succeded ? Created() : StatusCode(res.StatusCode, res.Error);
        }
    }
}
