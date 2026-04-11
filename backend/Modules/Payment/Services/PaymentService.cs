using backend.Data;
using backend.Modules.CoursesBase.Models;
using backend.Modules.Engagement.Models;
using backend.Modules.Engagement.Services;
using backend.Modules.Payment.DTOs;
using backend.Modules.Payment.Models;
using backend.Modules.Shared.Results;
using Microsoft.EntityFrameworkCore;

namespace backend.Modules.Payment.Services
{
    public class PaymentService
    {
        private readonly AppDbContext _db;
        private readonly INotificationService _notificationService;

        public PaymentService(AppDbContext db, INotificationService notificationService)
        {
            _db = db;
            _notificationService = notificationService;
        }

        public async Task<ServiceResult<Guid>> CreatePayment(string userId, PaymentDTO dto, CancellationToken ct)
        {
            var course = await _db.CourseBases.Where(x => x.Id == dto.CourseBaseId).Select(x => new {x.Type, x.PriceCurrencyId, x.TeacherId}).FirstOrDefaultAsync(ct);

            if (course is null)
            {
                return ServiceResult<Guid>.NotFound("Course not found");
            }

            var newInvoice = new Invoice
            {
                UserId = userId,
                CurrencyId = course.PriceCurrencyId,
                TokenCount = dto.TokenCount,
                PaidPrice = dto.PaidPrice,
                Status = PaymentStatus.Pending,
                WallId = course.Type == CourseType.Tutoring ? dto.InstanceId : null,
                EnrollmentId = course.Type == CourseType.LearningPath ? dto.InstanceId : null,
            };

            _db.Invoices.Add(newInvoice);

            var userName = await _db.Users.Where(x => x.Id == userId).Select(x => x.FullName).FirstOrDefaultAsync(ct);

            if (userName is null)
            {
                return ServiceResult<Guid>.NotFound("Student not found");
            }

            await _notificationService.NotifyAsync(course.TeacherId, NotificationType.PendingInvoice, null, userId, userName);
            await _db.SaveChangesAsync(ct);

            return ServiceResult<Guid>.Success(newInvoice.Id);
        }

        public async Task<ServiceResult> ReactToPayment(PaymentReactionDTO dto, CancellationToken ct)
        {
            var invoice = await _db.Invoices.Where(x => x.Id == dto.InvoiceId).FirstOrDefaultAsync(ct);

            if (invoice is null) {
                return ServiceResult<Guid>.NotFound("No invoice found");
            }

            var course = invoice.WallId switch
            {
                null => await _db.PathEnrollments.Where(x => x.Id == invoice.EnrollmentId).Select(x => new { x.CourseId, x.Course.CourseName, x.Course.TeacherId }).FirstAsync(ct),
                not null => await _db.TutoringWalls.Where(x => x.Id == invoice.WallId).Select(x => new { x.CourseId, x.CourseBase.CourseName, x.CourseBase.TeacherId }).FirstAsync(ct),
            };

            switch (dto.Accepted)
            {
                case true:
                    invoice.Status = PaymentStatus.Accepted;

                    var tokenTransaction = new TokenTransaction
                    {
                        InvoiceId = invoice.Id,
                        Type = TransactionType.Purchase,
                        TokenCount = invoice.TokenCount,
                        EnrollmentId = invoice.EnrollmentId,
                        WallId = invoice.WallId,
                    };

                    _db.TokenTransactions.Add(tokenTransaction);

                    if (invoice.WallId is not null)
                    {
                        var wall = await _db.TutoringWalls.Where(x => x.Id == invoice.WallId).FirstAsync(ct);
                        wall.TokenCount += invoice.TokenCount;
                        _db.TutoringWalls.Update(wall);
                    }
                    else if (invoice.EnrollmentId is not null)
                    {
                        var enrollment = await _db.PathEnrollments.Where(x => x.Id == invoice.EnrollmentId).FirstAsync(ct);
                        enrollment.TokenCount += invoice.TokenCount;
                        _db.PathEnrollments.Update(enrollment);
                    }
                    else
                    {
                        return ServiceResult<Guid>.NotFound("No instance enrollment found");
                    }

                    await _notificationService.NotifyAsync(invoice.UserId, NotificationType.PaymentAcceptance, invoice.WallId ?? invoice.EnrollmentId, course.TeacherId, course.CourseName);

                    break;
                case false:
                    invoice.Status = PaymentStatus.Failed;

                    await _notificationService.NotifyAsync(invoice.UserId, NotificationType.PaymentRefusal, invoice.WallId ?? invoice.EnrollmentId, course.TeacherId, course.CourseName);

                    break;
            }
            _db.Invoices.Update(invoice);
            await _db.SaveChangesAsync(ct);

            return ServiceResult.Success();
        }
    }
}
