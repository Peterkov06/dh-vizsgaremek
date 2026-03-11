using backend.Modules.Engagement.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Data.Configurations.Engagement
{
    public class ChatMessageConfiguration: ModelBaseConfiguration<ChatMessage>
    {
        public override void Configure(EntityTypeBuilder<ChatMessage> builder)
        {
            base.Configure(builder);
            builder.ToTable("chat_messages");
            builder.Property(x => x.Text).IsRequired();
            builder.Property(x => x.SenderId).IsRequired();

            builder.HasOne(x => x.Chat).WithMany(x => x.Messages).HasForeignKey(x => x.ChatId).IsRequired().OnDelete(DeleteBehavior.Cascade);
        }
    }
}
