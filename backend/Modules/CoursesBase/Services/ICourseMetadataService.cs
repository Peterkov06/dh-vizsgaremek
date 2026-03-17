namespace backend.Modules.CoursesBase.Services
{
    public interface ICourseMetadataService
    {
        Task GetAllTags();
        Task CreateTag();
        Task CreateMultipleTags();
        Task DeleteTag();

        Task GetAllDomains();
        Task CreateDomain();
        Task DeleteDomain();

    }
}
