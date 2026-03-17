using backend.Modules.Shared.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Modules.Resources.Models
{
    public class TestModuleAnswer: ModelBase
    {
        public required Guid ModuleId { get; set; }
        public required string Text { get; set; }
        public required bool IsCorrect { get; set; } = false;
        public TestModule? Module { get; set; }
    }
}
