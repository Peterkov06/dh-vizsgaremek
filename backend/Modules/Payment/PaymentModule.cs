using backend.Modules.Payment.Services;

namespace backend.Modules.Payment
{
    public static class PaymentModule
    {
        public static IServiceCollection AddPaymentServices(this IServiceCollection services)
        {
            services.AddScoped<IPaymentService, PaymentService>();
            return services;
        }
    }
}
