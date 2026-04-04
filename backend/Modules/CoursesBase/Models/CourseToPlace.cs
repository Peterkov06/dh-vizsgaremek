using backend.Models.Cities;
using backend.Modules.Shared.Models;

namespace backend.Modules.CoursesBase.Models
{
    public class CourseToPlace: ModelBase
    {
        public Guid CourseId { get; set; }
        public int? PlaceId { get; set; }
        public required bool Online { get; set; }

        public CourseBaseModel? CourseBase { get; set; }
        public City? City { get; set; }
    }
}
