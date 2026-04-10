namespace backend.Modules.Tutoring.DTOs
{
    public class TutoringWallPostDTO
    {
        public Guid? Id { get; set; } = null;
        public required string PosterName { get; set; }
        public required string PosterId { get; set; }
        public required string PosterImg { get; set; }
        public string? Title { get; set; } = null; 
        public string? Text { get; set; } = null;
        public Guid? HandInId { get; set; } = null;
        public DateTime? DueDate { get; set; } = null;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public List<string> AttachmentURLs { get; set; } = [];
        public List<WallCommentDTO> Comments { get; set; } = [];
    }
}
