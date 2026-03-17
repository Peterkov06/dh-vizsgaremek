using backend.Data;
using backend.Modules.Shared.DTOs;
using backend.Modules.Shared.Models;
using backend.Modules.Shared.Results;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace backend.Modules.CoursesBase.Services
{
    public class CourseMetadataService : ICourseMetadataService
    {
        private readonly AppDbContext _db;

        public CourseMetadataService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<ServiceResult> CreateDomain(LookUpDTO domain, CancellationToken ct = default)
        {
            var exists = await _db.CourseDomains.AnyAsync(x => x.Name == domain.Name);

            if (exists)
            {
                return ServiceResult.Failure("Domain already exists");
            }

            LookUp newDomain = new LookUp() { Name = domain.Name };
            _db.CourseDomains.Add(newDomain);
            await _db.SaveChangesAsync(ct);
            return ServiceResult.Success();
        }

        public async Task<ServiceResult> CreateLevel(LookUpDTO level, CancellationToken ct = default)
        {
            var exists = await _db.CourseLevels.AnyAsync(x => x.Name == level.Name);

            if (exists)
            {
                return ServiceResult.Failure("Level already exists");
            }

            LookUp newLevel = new LookUp() { Name = level.Name };
            _db.CourseLevels.Add(newLevel);
            await _db.SaveChangesAsync(ct);
            return ServiceResult.Success();
        }

        public async Task<ServiceResult> CreateMultipleTags(List<LookUpDTO> tags, CancellationToken ct = default)
        {
            var tagNames = tags.Select(x => x.Name).ToList();

            var existingNames = await _db.CourseTags.Where(x => tagNames.Contains(x.Name)).Select(x => x.Name).ToListAsync();

            if (existingNames.Count > 0)
            {
                return ServiceResult.Failure($"These tags already exist: {string.Join(", ", existingNames)}");
            }

            foreach (var tag in tags)
            {
                LookUp newTag = new LookUp() { Name = tag.Name };
                _db.CourseTags.Add(newTag);
            }
            await _db.SaveChangesAsync(ct);
            return ServiceResult.Success();
        }

        public async Task<ServiceResult> CreateTag(LookUpDTO tag, CancellationToken ct = default)
        {
            var exists = await _db.CourseTags.AnyAsync(x => x.Name == tag.Name);

            if (exists)
            {
                return ServiceResult.Failure("Tag already exists");
            }

            LookUp newTag = new LookUp() { Name = tag.Name };
            _db.CourseTags.Add(newTag);
            await _db.SaveChangesAsync(ct);
            return ServiceResult.Success();
        }

        public async Task<ServiceResult> DeleteDomain(Guid id)
        {
            var domain = await _db.CourseDomains.FirstOrDefaultAsync(x => x.Id == id);
            if (domain == null)
            {
                return ServiceResult.NotFound("Domain not found");
            }

            var inUse = await _db.CourseBases.AnyAsync(y => y.CourseDomainId == id);
            if (inUse)
            {
                return ServiceResult.Failure("Cannot delete domain while used by courses");
            }

            _db.CourseDomains.Remove(domain);
            await _db.SaveChangesAsync();
            return ServiceResult.Success();
        }

        public async Task<ServiceResult> DeleteLevels(Guid id)
        {
            var level = await _db.CourseLevels.FirstOrDefaultAsync(x => x.Id == id);
            if (level == null)
            {
                return ServiceResult.NotFound("Level not found");
            }

            var inUse = await _db.CourseBases.AnyAsync(y => y.CourseLevelId == id);
            if (inUse)
            {
                return ServiceResult.Failure("Cannot delete level while used by courses");
            }

            _db.CourseLevels.Remove(level);
            await _db.SaveChangesAsync();
            return ServiceResult.Success();
        }


        public async Task<ServiceResult> DeleteTag(Guid id)
        {
            var tag = await _db.CourseTags.FirstOrDefaultAsync(x => x.Id == id);
            if (tag == null)
            {
                return ServiceResult.NotFound("Tag not found");
            }

            var inUse = await _db.CoursesToTags.AnyAsync(y => y.TagId == id);
            if (inUse)
            {
                return ServiceResult.Failure("Cannot delete tag while used by courses");
            }

            _db.CourseTags.Remove(tag);
            await _db.SaveChangesAsync();
            return ServiceResult.Success();
        }

        public async Task<ServiceResult<List<LookUpDTO>>> GetAllDomains()
        {
            var domains = await _db.CourseDomains.OrderBy(x => x.Name).Select(x => new LookUpDTO { Name = x.Name, Id = x.Id }).ToListAsync();
            return ServiceResult<List<LookUpDTO>>.Success(domains);
        }

        public async Task<ServiceResult<List<LookUpDTO>>> GetAllLevels()
        {
            var levels = await _db.CourseLevels.OrderBy(x => x.Name).Select(x => new LookUpDTO { Name = x.Name, Id = x.Id }).ToListAsync();
            return ServiceResult<List<LookUpDTO>>.Success(levels);
        }

        public async Task<ServiceResult<List<LookUpDTO>>> GetAllTags()
        {
            var tags = await _db.CourseTags.OrderBy(x => x.Name).Select(x => new LookUpDTO { Name = x.Name, Id = x.Id }).ToListAsync();
            return ServiceResult<List<LookUpDTO>>.Success(tags);
        }
    }
}
