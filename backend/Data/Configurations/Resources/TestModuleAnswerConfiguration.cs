using backend.Modules.Resources.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data.Configurations.Resources
{
    public class TestModuleAnswerConfiguration: ModelBaseConfiguration<TestModuleAnswer>
    {
        public override void Configure(EntityTypeBuilder<TestModuleAnswer> builder)
        {
            base.Configure(builder);
            builder.ToTable("test_module_answers");
            builder.Property(x => x.Text).IsRequired().HasMaxLength(255);
            builder.Property(x => x.IsCorrect).IsRequired();

            builder.HasOne(x => x.Module).WithMany(x => x.Answers).HasForeignKey(x => x.ModuleId).IsRequired(false).OnDelete(DeleteBehavior.Cascade);
        }
    }
}
