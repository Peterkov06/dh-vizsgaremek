namespace backend.Modules.Identity.DTOs
{
    public class StudentProfileDTO
    {
        public string Id { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string? Nickname { get; set; } = null;
        public string Introduction { get; set; } = string.Empty;
        public string ProfilePictureUrl { get; set; } = string.Empty;

    }
}
