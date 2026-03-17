using backend.Modules.Shared.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Modules.Resources.Models
{
    public class TestModule: ModelBase
    {
        public required Guid TestId { get; set; }
        public required TestModuleType Type { get; set; }
        public required string Task { get; set; }
        public string? Description { get; set; } = null;
        public int? MaxPoints { get; set; } = null;

        public Test? Test { get; set; }
        public ICollection<TestModuleAnswer> Answers { get; set; } = [];

    }
}
