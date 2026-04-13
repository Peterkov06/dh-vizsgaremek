using backend.Modules.Resources.Services;
using backend.Modules.Scheduling.Services;

namespace backend.Modules.Resources
{
    public static class ResourcesModule
    {
        public static IServiceCollection AddResourcesServices(this IServiceCollection services)
        {
            services.AddScoped<IFileManagerService, FileManagerService>();
            return services;
        }
    }
}
