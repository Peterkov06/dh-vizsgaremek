using backend.Modules.Engagement.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data.Configurations.Engagement
{
    public class ChatRoomConfiguration:ModelBaseConfiguration<ChatRoom>
    {
        public override void Configure(EntityTypeBuilder<ChatRoom> builder)
        {
            base.Configure(builder);
            builder.ToTable("chat_rooms", x =>
            {
                x.HasCheckConstraint("CK_ChatRoom_SingleContext", @"((""WallId"" IS NOT NULL)::int + (""EnrollmentId"" IS NOT NULL)::int) = 1");
            });

            builder.HasOne(x => x.Wall).WithOne().HasForeignKey<ChatRoom>(x => x.WallId).IsRequired(false).OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(x => x.Enrollment).WithOne().HasForeignKey<ChatRoom>(x => x.EnrollmentId).IsRequired(false).OnDelete(DeleteBehavior.Cascade);
        }
    }
}
