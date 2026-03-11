using backend.Modules.Resources.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data.Configurations.Resources
{
    public class TestConfiguration: ModelBaseConfiguration<Test>
    {
        public override void Configure(EntityTypeBuilder<Test> builder)
        {
            base.Configure(builder);
            builder.ToTable("tests");
            builder.Property(x => x.MaxTime).IsRequired(false);
        }
    }
}
