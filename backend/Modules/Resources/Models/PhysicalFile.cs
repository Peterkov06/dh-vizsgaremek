using backend.Modules.Shared.Models;
using System.Numerics;

namespace backend.Modules.Resources.Models
{
    public class PhysicalFile: ModelBase
    {
        public required string StoragePath { get; set; }
        public required string FileName { get; set; }
        public required string MimeType { get; set; }
        public BigInteger Size { get; set; }
    }
}
