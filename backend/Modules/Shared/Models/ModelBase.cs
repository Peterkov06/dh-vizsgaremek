using System.ComponentModel.DataAnnotations;

namespace backend.Modules.Shared.Models
{
    public abstract class ModelBase
    {
        public Guid Id { get; protected set; } = Guid.NewGuid();
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
