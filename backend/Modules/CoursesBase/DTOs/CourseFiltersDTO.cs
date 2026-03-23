using backend.Modules.CoursesBase.Models;

namespace backend.Modules.CoursesBase.DTOs
{
    public class CourseFiltersDTO
    {
        public required int CoursesPerPage { get; set; } = 12;
        public required int PageNum { get; set; } = 1;
        public string? Keyword { get; set; } = null;
        public OrderByType OrderBy { get; set; } = OrderByType.Popularity;
        public List<Guid>? Domains { get; set; } = null;
        public List<Guid>? Tags { get; set; } = null;
        public List<Guid>? Levels { get; set; } = null;
        public List<Guid>? Languages { get; set; } = null;
        public int? MinPrice { get; set; } = null;
        public int? MaxPrice { get; set; } = null;


    }
}
