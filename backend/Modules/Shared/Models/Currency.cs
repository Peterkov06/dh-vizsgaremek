namespace backend.Modules.Shared.Models
{
    public class Currency
    {
        public required Guid Id { get; set; } = new();
        public string Name { get; set; } = string.Empty;
        public string CurrencyCode { get; set; } = string.Empty;
        public string CurrencySymbol { get; set; } = string.Empty;
    }
}
