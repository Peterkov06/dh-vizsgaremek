namespace backend.Modules.Identity.DTOs
{
    public abstract class ProfileBaseDTO
    {
        public string Id { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Introduction { get; set; } = string.Empty;
        public string? ProfilePictureUrl { get; set; } = null;
        public string Type { get; set; } = "Student";
        public int Age { get; set; } = 0;
    }
}
