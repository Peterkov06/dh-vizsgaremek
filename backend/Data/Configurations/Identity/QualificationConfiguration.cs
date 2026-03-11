using backend.Modules.Identity.Models;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data.Configurations.Identity
{
    public class QualificationConfiguration: ModelBaseConfiguration<Qualification>
    {
        public override void Configure(EntityTypeBuilder<Qualification> builder)
        {
            base.Configure(builder);

        }
    }
}
