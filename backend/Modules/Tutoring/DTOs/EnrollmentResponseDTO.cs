namespace backend.Modules.Tutoring.DTOs
{
    public class EnrollmentResponseDTO
    {
        public required Guid EnrollmentID { get; set; }
        public required bool Accepted { get; set; }
    }
}
