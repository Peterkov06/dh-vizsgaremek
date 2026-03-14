namespace backend.Shared.Models
{
    public class Currency
    {
        public required Guid Id { get; set; }
        public required string Name { get; set; }
        public required string CurrencyCode { get; set; }
        public required string CurrencySymbol { get; set; }
    }
}
