using backend.Modules.Shared.DTOs;

namespace backend.Modules.Pages.Teacher.DTOs
{
    public class StudentItemDTO
    {
        public string UserId { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string NickName { get; set; } = string.Empty;
        public List<LookUpDTO> Courses { get; set; } = [];
        public Guid ChatId { get; set; }
        public string? ProfilePictureUrl { get; set; } = null;
    }
}
