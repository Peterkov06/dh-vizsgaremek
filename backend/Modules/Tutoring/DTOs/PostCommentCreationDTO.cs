namespace backend.Modules.Tutoring.DTOs
{
    public class PostCommentCreationDTO
    {
        public Guid WallId { get; set; }
        public Guid PostId { get; set; }
        public string Text { get; set; } = string.Empty;
    }
}
