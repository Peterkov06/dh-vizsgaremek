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
            builder.ToTable("chat_rooms");

            builder.HasOne(x => x.Student).WithMany(x => x.Chats).HasForeignKey(x => x.StudentId).OnDelete(DeleteBehavior.SetNull);
            builder.HasOne(x => x.Teacher).WithMany(x => x.Chats).HasForeignKey(x => x.TeacherId).OnDelete(DeleteBehavior.SetNull);
        }
    }
}
