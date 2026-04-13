namespace backend.Modules.Resources.DTOs
{
    public class UploadResultDTO
    {
        public required Guid FileId { get; set; }
        public required string URL { get; set; }
    }
}
