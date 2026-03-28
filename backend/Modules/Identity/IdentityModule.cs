
using backend.Modules.Identity.Services;

namespace backend.Modules.Identity
{
    public static class IdentityModule
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services)
        {
            services.AddScoped<IProfileService, ProfileService>();
            return services;
        }
    }
}
