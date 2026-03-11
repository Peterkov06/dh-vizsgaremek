using backend.Modules.Resources.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data.Configurations.Resources
{
    public class TestModuleConfiguration: ModelBaseConfiguration<TestModule>
    {
        public override void Configure(EntityTypeBuilder<TestModule> builder)
        {
            base.Configure(builder);
            builder.ToTable("test_modules");
            builder.Property(x => x.Type).IsRequired().HasConversion<string>().HasMaxLength(50);
            builder.Property(x => x.Task).IsRequired().HasMaxLength(255);
            builder.Property(x => x.Description).IsRequired().HasMaxLength(500);
            builder.Property(x => x.MaxPoints).IsRequired(false);

            builder.HasOne(x => x.Test).WithMany(x => x.TestModules).HasForeignKey(x => x.TestId).IsRequired().OnDelete(DeleteBehavior.Cascade);
        }
    }
}
