using backend.Modules.Tutoring.Services;

namespace backend.Modules.Tutoring
{
    public static class TutoringModule
    {
        public static IServiceCollection AddTutoringServices(this IServiceCollection services)
        {
            services.AddScoped<ITutoringManagementService, TutoringManagementService>();
            return services;
        }
    }
}
