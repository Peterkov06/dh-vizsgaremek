using backend.Modules.Resources.Models;

namespace backend.Modules.Tutoring.DTOs
{
    public class NewHandinDTO
    {
        public required string Title { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
        public int MaxPoints { get; set; } = 0;
        public HandInType Type { get; set; }
        public DateTime DueDate { get; set; }
        public Guid WallId { get; set; }
    }
}
