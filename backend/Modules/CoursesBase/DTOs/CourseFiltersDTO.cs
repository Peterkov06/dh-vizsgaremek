using backend.Modules.CoursesBase.Models;

namespace backend.Modules.CoursesBase.DTOs
{
    public class CourseFiltersDTO
    {
        public int CoursesPerPage { get; set; } = 12;
        public int PageNum { get; set; } = 1;
        public string? Keyword { get; set; } = null;
        public OrderByType OrderBy { get; set; } = OrderByType.Popularity;
        public List<string>? Domains { get; set; } = null;
        public List<string>? Tags { get; set; } = null;
        public List<string>? Levels { get; set; } = null;
        public List<string>? Languages { get; set; } = null;
        public List<string>? Locations { get; set; } = null;
        public int? MinPrice { get; set; } = null;
        public int? MaxPrice { get; set; } = null;
        public string? TeacherId { get; set; } = null;

    }
}
