using backend.Data;
using backend.Modules.CoursesBase.Models;
using backend.Modules.Engagement.Models;
using backend.Modules.Engagement.Services;
using backend.Modules.Payment.DTOs;
using backend.Modules.Payment.Models;
using backend.Modules.Scheduling.Models;
using backend.Modules.Shared.Results;
using Microsoft.EntityFrameworkCore;

namespace backend.Modules.Payment.Services
{
    public class PaymentService: IPaymentService
    {
        private readonly AppDbContext _db;
        private readonly INotificationService _notificationService;

        public PaymentService(AppDbContext db, INotificationService notificationService)
        {
            _db = db;
            _notificationService = notificationService;
        }

        public async Task<ServiceResult<Guid>> CreatePayment(string userId, PaymentDTO dto, CancellationToken ct = default)
        {
            var course = await _db.CourseBases.Where(x => x.Id == dto.CourseBaseId).Select(x => new {x.Type, x.PriceCurrencyId, x.TeacherId, x.Price}).FirstOrDefaultAsync(ct);

            if (course is null)
            {
                return ServiceResult<Guid>.NotFound("Course not found");
            }

            var newInvoice = new Invoice
            {
                UserId = userId,
                CurrencyId = course.PriceCurrencyId,
                TokenCount = dto.TokenCount,
                PaidPrice = dto.TokenCount * course.Price,
                Status = PaymentStatus.Pending,
                WallId = course.Type == CourseType.Tutoring ? dto.InstanceId : null,
                EnrollmentId = course.Type == CourseType.LearningPath ? dto.InstanceId : null,
                TeacherId = course.TeacherId,
            };

            _db.Invoices.Add(newInvoice);

            var userName = await _db.Users.Where(x => x.Id == userId).Select(x => x.FullName).FirstOrDefaultAsync(ct);

            if (userName is null)
            {
                return ServiceResult<Guid>.NotFound("Student not found");
            }

            await _notificationService.NotifyAsync(course.TeacherId, NotificationType.PendingInvoice, newInvoice.Id, userId, userName);
            await _db.SaveChangesAsync(ct);

            return ServiceResult<Guid>.Success(newInvoice.Id);
        }

        public async Task<ServiceResult> ReactToPayment(PaymentReactionDTO dto, CancellationToken ct = default)
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

            var nType = NotificationType.PaymentAcceptance;
            ServiceResult? transactionRes = null;

            switch (dto.Accepted)
            {
                case true:
                    invoice.Status = PaymentStatus.Accepted;

                    if (invoice.WallId is not null)
                    {
                        transactionRes = await CreateWallTokenTransaction(TransactionType.Purchase, (Guid)invoice.WallId, invoice.Id, invoice.TokenCount, ct);
                    }
                    else if (invoice.EnrollmentId is not null)
                    {
                        transactionRes = await CreateEnrollmentTokenTransaction(TransactionType.Purchase, (Guid)invoice.EnrollmentId, invoice.Id, invoice.TokenCount, ct);
                    }
                    else
                    {
                        return ServiceResult<Guid>.NotFound("No instance enrollment found");
                    }

                    break;
                case false:
                    invoice.Status = PaymentStatus.Failed;
                    nType = NotificationType.PaymentRefusal;

                    break;
            }

            if (transactionRes is not null && !transactionRes.Succeded)
            {
                return ServiceResult.Failure(transactionRes.Error ?? "", transactionRes.StatusCode);
            }

            var readNotifications = await _db.Notifications.Where(x => x.RecipientId == invoice.TeacherId && !x.IsRead && x.Type == NotificationType.PendingInvoice && x.ReferenceId == invoice.Id).Select(x => x.Id).ToListAsync(ct);

            await _notificationService.SetNotificationsToRead(readNotifications, ct);
            await _notificationService.NotifyAsync(invoice.UserId, nType, invoice.WallId ?? invoice.EnrollmentId, course.TeacherId, course.CourseName);
            _db.Invoices.Update(invoice);
            await _db.SaveChangesAsync(ct);

            return ServiceResult.Success();
        }

        public async Task<ServiceResult<List<InvoiceDTO>>> GetTeacherInvoices(string userId, CancellationToken ct = default)
        {
            var payments = await _db.Invoices.Where(x => x.TeacherId == userId)
                .Select(x => new InvoiceDTO
                {
                    CourseName = x.Wall.CourseBase.CourseName ?? x.Enrollment.Course.CourseName,
                    UserName = x.User.FullName,
                    InvoiceId = x.Id,
                    InstanceId = x.WallId != null ? (Guid)x.WallId : x.EnrollmentId != null ? (Guid)x.EnrollmentId : Guid.Empty,
                    CreatedAt = x.CreatedAt,
                    Currency = x.Currency,
                    TokenCount = x.TokenCount,
                    UserId = x.UserId,
                    OneTokenPrice = x.Wall != null ? x.Wall.CourseBase.TokenMinuteValue : x.Enrollment != null ? x.Enrollment.Course.TokenMinuteValue : 0,
                    PaidPrice = x.PaidPrice,
                    Status = x.Status,
                    UserImageURL = x.User.ProfilePicture.StoragePath ?? "",
                })
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync(ct);

            return ServiceResult<List<InvoiceDTO>>.Success(payments);
        }

        public async Task<ServiceResult> CreateWallTokenTransaction(TransactionType transactionType, Guid instanceId, Guid? invoiceId, int tokenCount, CancellationToken ct = default)
        {
            var newTransaction = new TokenTransaction
            {
                Type = transactionType,
                InvoiceId = invoiceId,
                TokenCount = tokenCount,
                WallId = instanceId,
            };

            var wall = await _db.TutoringWalls.Where(x => x.Id == instanceId).FirstOrDefaultAsync(ct);
            var remainingTokens = 0;

            if (wall is null)
            {
                return ServiceResult.NotFound("No tutoring enrollment found");
            }

            switch (transactionType)
            {
                case TransactionType.Refound:
                case TransactionType.Purchase:
                    remainingTokens = wall.TokenCount + tokenCount;

                    wall.TokenCount = remainingTokens;
                    break;
                case TransactionType.LessonSpent:
                    remainingTokens = wall.TokenCount - tokenCount;

                    if (remainingTokens < 0)
                        return ServiceResult<Event>.Failure("Not enough tokens for the booking");

                    wall.TokenCount = remainingTokens;
                    break;
                default:
                    break;
            }
            _db.TutoringWalls.Update(wall);
            _db.TokenTransactions.Add(newTransaction);

            try
            {
                await _db.SaveChangesAsync(ct);
                return ServiceResult.Success();
            }
            catch (Exception)
            {
                return ServiceResult.Failure("No transactions were saved");
            }


        }

        public async Task<ServiceResult> CreateEnrollmentTokenTransaction(TransactionType transactionType, Guid instanceId, Guid? invoiceId, int tokenCount, CancellationToken ct = default)
        {
            var newTransaction = new TokenTransaction
            {
                Type = transactionType,
                InvoiceId = invoiceId,
                TokenCount = tokenCount,
                WallId = instanceId,
            };

            var enrollment = await _db.PathEnrollments.Where(x => x.Id == instanceId).FirstOrDefaultAsync(ct);
            var remainingTokens = 0;

            if (enrollment is null)
            {
                return ServiceResult.NotFound("No enrollment found");
            }

            switch (transactionType)
            {
                case TransactionType.Refound:
                case TransactionType.Purchase:
                    remainingTokens = enrollment.TokenCount + tokenCount;

                    enrollment.TokenCount = remainingTokens;
                    break;
                case TransactionType.LessonSpent:
                    remainingTokens = enrollment.TokenCount - tokenCount;

                    if (remainingTokens < 0)
                        return ServiceResult<Event>.Failure("Not enough tokens for the booking");

                    enrollment.TokenCount = remainingTokens;
                    break;
                default:
                    break;
            }
            _db.PathEnrollments.Update(enrollment);
            _db.TokenTransactions.Add(newTransaction);

            try
            {
                await _db.SaveChangesAsync(ct);
                return ServiceResult.Success();
            }
            catch (Exception)
            {
                return ServiceResult.Failure("No transactions were saved");
            }


        }
    }
}
