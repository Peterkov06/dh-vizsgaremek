namespace backend.Modules.Tutoring.DTOs
{
    public class NewWallPostDTO
    {
        public required Guid WallId { get; set; }
        public string? Text { get; set; } = null;
    }
}
