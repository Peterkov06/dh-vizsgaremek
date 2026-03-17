namespace backend.Modules.Shared.DTOs
{
    public class CurrencyDTO
    {
        public Guid? Id { get; set; } = null;
        public string Name { get; set; } = string.Empty;
        public string CurrencyCode { get; set; } = string.Empty;
        public string CurrencySymbol { get; set; } = string.Empty;
    }
}
