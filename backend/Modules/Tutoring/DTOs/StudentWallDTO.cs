namespace backend.Modules.Tutoring.DTOs
{
    public class StudentWallDTO
    {
        public required string CourseName { get; set; }
        public Guid InstanceId { get; set; }
    }

    public class StudentWallsDTO
    {
        public List<StudentWallDTO> Walls { get; set; } = [];
    }
}
