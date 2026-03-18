using backend.Modules.Shared.Services;

namespace backend.Modules.Shared
{
    public static class SharedModule
    {
        public static IServiceCollection AddSharedServices(this IServiceCollection services) {
            services.AddScoped<ILookUpService, LookUpService>();
            return services;
        }
    }
}
