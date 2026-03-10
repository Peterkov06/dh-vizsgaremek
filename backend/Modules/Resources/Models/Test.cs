using backend.Shared.Models;

namespace backend.Modules.Resources.Models
{
    public class Test: ModelBase
    {
        public TimeOnly? MaxTime { get; set; } = null;

        public ICollection<TestModule> TestModules { get; set; } = [];
    }
}
