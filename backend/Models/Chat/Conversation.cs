using System.ComponentModel.DataAnnotations;

namespace backend.Models.Chat
{
    public class Conversation
    {
        [Key]
        public Guid Id { get; set; }
        required public string Name { get; set; }
        required public string Type { get; set; }

        public Conversation()
        {
            Id = Guid.NewGuid();
        }
    }
}
