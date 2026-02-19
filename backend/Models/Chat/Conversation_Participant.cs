using System.ComponentModel.DataAnnotations;

namespace backend.Models.Chat
{
    public class Conversation_Participant
    {
        [Key]
        public Guid Id { get; set; }
    }
}
