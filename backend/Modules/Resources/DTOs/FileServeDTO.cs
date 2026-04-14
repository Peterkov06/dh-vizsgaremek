namespace backend.Modules.Resources.DTOs
{
    public class FileServeDTO: IDisposable
    {
        public required Stream Stream { get; init; }
        public required string MimeType { get; init; }
        public required string OriginalFileName { get; init; }

        public void Dispose() => Stream.Dispose();
    }
}
