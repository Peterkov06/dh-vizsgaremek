using backend.Shared.Models;

namespace backend.Modules.CoursesBase.Models
{
    public class CourseDomain: ModelBase
    {
        public required string Name { get; set; }
    }
}
