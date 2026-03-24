using backend.Modules.Engagement.Services;

namespace backend.Modules.Engagement
{
    public static class EngagementModule
    {
        public static IServiceCollection AddEngagementServices(this IServiceCollection services)
        {
            services.AddScoped<ICommunicationService, CommunicationService>();
            return services;
        }
    }
}
