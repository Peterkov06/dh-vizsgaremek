using backend.Modules.CoursesBase.DTOs;
using backend.Modules.Shared.DTOs;

namespace backend.Modules.Pages.Shared.DTOs
{
    public class CourseExplorerPageDTO
    {
        public List<LookUpDTO> Domains { get; set; } = [];
        public List<LookUpDTO> Tags { get; set; } = [];
        public List<LookUpDTO> Languages { get; set; } = [];
        public List<LookUpDTO> Levels { get; set; } = [];
        public required CourseBaseListResultDTO Courses { get; set; }
        public int MinPrice { get; set; } = 0;
        public int MaxPrice { get; set; } = 0;

    }
}
