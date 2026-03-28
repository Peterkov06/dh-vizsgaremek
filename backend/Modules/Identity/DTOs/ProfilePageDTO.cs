namespace backend.Modules.Identity.DTOs
{
    public class ProfilePageDTO
    {
        public required string UserType { get; set; } = "Student";
        public required ProfileBaseDTO Profile { get; set; }
    }
}
