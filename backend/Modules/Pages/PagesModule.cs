using backend.Modules.Pages.Student.Services;

namespace backend.Modules.Pages
{
    public static class PagesModule
    {
        public static IServiceCollection AddPagesServices(this IServiceCollection services)
        {
            services.AddScoped<IStudentPageService, StudentPageService>();
            return services;
        }
    }
}
