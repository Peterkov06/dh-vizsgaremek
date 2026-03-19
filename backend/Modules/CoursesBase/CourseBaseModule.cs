using backend.Modules.CoursesBase.Services;

namespace backend.Modules.CoursesBase
{
    public static class CourseBaseModule
    { 
        public static IServiceCollection AddCoursesServiceCollection(this IServiceCollection services)
        {
            services.AddScoped<ICourseMetadataService, CourseMetadataService>();
            services.AddScoped<ICourseBaseService, CourseBaseService>();
            return services;
        }
    }
}
