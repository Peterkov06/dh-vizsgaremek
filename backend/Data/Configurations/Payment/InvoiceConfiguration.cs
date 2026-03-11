using backend.Modules.Payment.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data.Configurations.Payment
{
    public class InvoiceConfiguration: ModelBaseConfiguration<Invoice>
    {
        public override void Configure(EntityTypeBuilder<Invoice> builder)
        {
            base.Configure(builder);
            builder.ToTable("invoices", x =>
            {
                x.HasCheckConstraint("CK_Invoices_SingleContext", @"((""WallId"" IS NOT NULL)::int + (""EnrollmentId"" IS NOT NULL)::int) = 1");
            });
            builder.Property(x => x.TokenCount).IsRequired();
            builder.Property(x => x.WallId).IsRequired(false);
            builder.Property(x => x.EnrollmentId).IsRequired(false);
            builder.Property(x => x.Status).IsRequired().HasConversion<string>().HasMaxLength(50);
            builder.Property(x => x.PaidPrice).IsRequired().HasPrecision(18,2);
            builder.Property(x => x.CurrencyId).IsRequired();
            builder.Property(x => x.UserId).IsRequired();

            builder.HasOne(x => x.Wall).WithMany().HasForeignKey(x => x.WallId).IsRequired(false).OnDelete(DeleteBehavior.Restrict);
            builder.HasOne(x => x.Enrollment).WithMany().HasForeignKey(x => x.EnrollmentId).IsRequired(false).OnDelete(DeleteBehavior.Restrict);
            builder.HasOne(x => x.Currency).WithMany().HasForeignKey(x => x.CurrencyId).IsRequired().OnDelete(DeleteBehavior.Restrict);
            builder.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId).IsRequired().OnDelete(DeleteBehavior.Restrict);
        }
    }
}
