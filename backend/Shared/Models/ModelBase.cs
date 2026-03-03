using System.ComponentModel.DataAnnotations;

namespace backend.Shared.Models
{
    public abstract class ModelBase
    {
        public Guid Id { get; protected set; } = Guid.NewGuid();
        public required DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
