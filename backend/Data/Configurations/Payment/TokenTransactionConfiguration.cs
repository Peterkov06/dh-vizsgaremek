using backend.Modules.Payment.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data.Configurations.Payment
{
    public class TokenTransactionConfiguration: ModelBaseConfiguration<TokenTransaction>
    {
        public override void Configure(EntityTypeBuilder<TokenTransaction> builder)
        {
            base.Configure(builder);
            builder.ToTable("token_transactions", x =>
            {
                x.HasCheckConstraint("CK_TokenTransaction_SingleContext", @"((""WallId"" IS NOT NULL)::int + (""EnrollmentId"" IS NOT NULL)::int) = 1");
            });
            builder.Property(x => x.TokenCount).IsRequired();
            builder.Property(x => x.Type).IsRequired().HasConversion<string>().HasMaxLength(50);
            
            builder.HasOne(x => x.Wall).WithMany().HasForeignKey(x => x.WallId).IsRequired(false).OnDelete(DeleteBehavior.Restrict);
            builder.HasOne(x => x.Enrollment).WithMany().HasForeignKey(x => x.EnrollmentId).IsRequired(false).OnDelete(DeleteBehavior.Restrict);
            builder.HasOne(x => x.Invoice).WithOne().HasForeignKey<TokenTransaction>(x => x.InvoiceId).IsRequired(false).OnDelete(DeleteBehavior.Restrict);
        }
    }
}
