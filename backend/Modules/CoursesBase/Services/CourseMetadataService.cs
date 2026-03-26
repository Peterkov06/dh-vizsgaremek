using backend.Data;
using backend.Modules.CoursesBase.Models;
using backend.Modules.Shared.DTOs;
using backend.Modules.Shared.Models;
using backend.Modules.Shared.Results;
using Microsoft.EntityFrameworkCore;

namespace backend.Modules.CoursesBase.Services
{
    public class CourseMetadataService : ICourseMetadataService
    {
        private readonly AppDbContext _db;

        public CourseMetadataService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<ServiceResult<LookUpDTO>> CreateDomainAsync(LookUpDTO domain, CancellationToken ct = default)
        {
            var exists = await _db.CourseDomains.AnyAsync(x => x.Name == domain.Name, ct);

            if (exists)
            {
                return ServiceResult<LookUpDTO>.Failure("Domain already exists");
            }

            CourseDomain newDomain = new () { Name = domain.Name };
            _db.CourseDomains.Add(newDomain);
            await _db.SaveChangesAsync(ct);
            return ServiceResult<LookUpDTO>.Success( new LookUpDTO() { Id = newDomain.Id, Name = newDomain.Name });
        }

        public async Task<ServiceResult<LookUpDTO>> CreateLevelAsync(LookUpDTO level, CancellationToken ct = default)
        {
            var exists = await _db.CourseLevels.AnyAsync(x => x.Name == level.Name, ct);

            if (exists)
            {
                return ServiceResult<LookUpDTO>.Failure("Level already exists");
            }

            CourseLevel newLevel = new () { Name = level.Name };
            _db.CourseLevels.Add(newLevel);
            await _db.SaveChangesAsync(ct);
            return ServiceResult<LookUpDTO>.Success(new LookUpDTO() { Id = newLevel.Id, Name = newLevel.Name });
        }

        public async Task<ServiceResult<List<Guid>>> CreateOrGetTagsAsync(List<string> tags, CancellationToken ct = default)
        {
            List<Guid> createdTags = [];
            foreach (var tag in tags)
            {
                var exists = await _db.CourseTags.Where(x => x.Name == tag).FirstOrDefaultAsync(ct);
                if (exists is not null)
                {
                    createdTags.Add(exists.Id);
                    continue;
                }
                CourseTag newTag = new () { Name = tag };
                _db.CourseTags.Add(newTag);
                createdTags.Add(newTag.Id);
            }
            await _db.SaveChangesAsync(ct);
            return ServiceResult<List<Guid>>.Success(createdTags);
        }

        public async Task<ServiceResult<LookUpDTO>> CreateTagAsync(LookUpDTO tag, CancellationToken ct = default)
        {
            var exists = await _db.CourseTags.AnyAsync(x => x.Name == tag.Name, ct);

            if (exists)
            {
                return ServiceResult<LookUpDTO>.Failure("Tag already exists");
            }

            CourseTag newTag = new () { Name = tag.Name };
            _db.CourseTags.Add(newTag);
            await _db.SaveChangesAsync(ct);
            return ServiceResult<LookUpDTO>.Success(new LookUpDTO() { Id = newTag.Id, Name = newTag.Name });
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

        public async Task<ServiceResult<List<LookUpDTO>>> GetAllDomainsAsync(CancellationToken ct = default)
        {
            var domains = await _db.CourseDomains.OrderBy(x => x.Name).Select(x => new LookUpDTO { Name = x.Name, Id = x.Id }).ToListAsync(ct);
            return ServiceResult<List<LookUpDTO>>.Success(domains);
        }

        public async Task<ServiceResult<List<LookUpDTO>>> GetAllLevelsAsync(CancellationToken ct = default)
        {
            var levels = await _db.CourseLevels.OrderBy(x => x.Name).Select(x => new LookUpDTO { Name = x.Name, Id = x.Id }).ToListAsync(ct);
            return ServiceResult<List<LookUpDTO>>.Success(levels);
        }

        public async Task<ServiceResult<List<LookUpDTO>>> GetAllTagsAsync(string? keyWord = null, CancellationToken ct = default)
        {
            var tagQuery = _db.CourseTags.AsQueryable();

            if (!string.IsNullOrEmpty(keyWord))
            {
                tagQuery = tagQuery.Where(x => x.Name.ToLower().StartsWith(keyWord.ToLower()));
            }

            var tags = await tagQuery.OrderBy(x => x.Name).Select(x => new LookUpDTO { Name = x.Name, Id = x.Id }).ToListAsync(ct);

            return ServiceResult<List<LookUpDTO>>.Success(tags);
        }

        public async Task<ServiceResult<List<LookUpDTO>>> GetCourseTags(Guid courseId, CancellationToken ct)
        {
            var tags = await _db.CoursesToTags.Where(x => x.CourseId == courseId).Select(x => new LookUpDTO { Id = x.TagId, Name = x.Tag.Name}).ToListAsync(ct);
            return ServiceResult<List<LookUpDTO>>.Success(tags);
        }
    }
}
