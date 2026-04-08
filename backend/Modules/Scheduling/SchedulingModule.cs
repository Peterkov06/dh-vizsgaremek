using backend.Modules.Scheduling.Services;

namespace backend.Modules.Scheduling
{
    public static class SchedulingModule
    {
        public static IServiceCollection AddSchedulingServices(this IServiceCollection services)
        {
            services.AddScoped<ISchedulingService, SchedulingService>();
            return services;
        }
    }
}
