using backend.Modules.Pages.Shared.Services;
using backend.Modules.Pages.Student.Services;
using backend.Modules.Pages.Teacher.Services;

namespace backend.Modules.Pages
{
    public static class PagesModule
    {
        public static IServiceCollection AddPagesServices(this IServiceCollection services)
        {
            services.AddScoped<IStudentPageService, StudentPageService>();
            services.AddScoped<ITeacherPageService, TeacherPageService>();
            services.AddScoped<ICourseExplorerPageService, CourseExplorerPageService>();
            return services;
        }
    }
}
