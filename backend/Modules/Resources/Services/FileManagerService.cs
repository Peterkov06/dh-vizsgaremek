using backend.Data;
using backend.Modules.Resources.DTOs;
using backend.Modules.Resources.Models;
using backend.Modules.Shared.Results;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Org.BouncyCastle.Asn1.Ocsp;
using static System.Net.Mime.MediaTypeNames;

namespace backend.Modules.Resources.Services
{
    public class FileManagerService: IFileManagerService
    {
        private readonly AppDbContext _db;
        private readonly string _basePath;

        private static readonly string[] DocumentExtensions =
        [   ".pdf", 
            ".docx", 
            ".doc", 
            ".txt",       
            ".rtf",       
            ".odt",       
            ".csv",      
            ".xlsx",      
            ".xlsm",      
            ".ods",
            ".pptx",
            ".ppt",
            ".odp", 
            ".zip", 
            ".7z", 
            ".rar"
        ];

        private static readonly string[] ImageExtensions =
        [    ".jpg", ".jpeg", 
            ".png",           
            ".webp",          
            ".gif",           
            ".tiff", ".tif",  
            ".bmp",           
            ".svg",           
        ];

        private static readonly string[] MediaExtensions =
        [
            ".mp4",
            ".mov",
            ".avi",
            ".wmv",
            ".flv",
            ".mkv",
            ".mp3", ".wav", ".aac"
        ];

        public FileManagerService(IConfiguration config, AppDbContext db)
        {
            _db = db;
            _basePath = config["FILES_BASE_PATH"] ?? "./wwwroot/files";
        }

        public async Task<ServiceResult<UploadResultDTO>> UploadFile(IFormFile file, string ownerId, string subFolder, UploadType type, CancellationToken ct = default)
        {
            List<string> allowedExtensions = type switch
            {
                UploadType.Image => [.. ImageExtensions],
                UploadType.Document => [.. DocumentExtensions, .. MediaExtensions],
                _ => [.. ImageExtensions, .. DocumentExtensions, .. MediaExtensions],
            };
            try
            {
                if (file == null || file.Length == 0)
                    return ServiceResult<UploadResultDTO>.Failure("No file uploaded");

                var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (string.IsNullOrEmpty(fileExtension) || !allowedExtensions.Contains(fileExtension))
                    return ServiceResult<UploadResultDTO>.Failure("Invalid file format");


                var uniqueFilename = $"{Guid.NewGuid()}{fileExtension}";
                var uploadPath = $"{_basePath}/{subFolder}";
                Directory.CreateDirectory(uploadPath);
                var fullPath = $"{uploadPath}/{uniqueFilename}";

                using (var stream = new FileStream(fullPath, FileMode.Create))
                    await file.CopyToAsync(stream, ct);

                var storagePath = $"{subFolder}/{uniqueFilename}";

                var physicalFile = new PhysicalFile
                {
                    StoragePath = storagePath,
                    FileName = file.FileName,
                    MimeType = file.ContentType,
                    Size = file.Length,
                    OwnerId = ownerId
                };

                await _db.PhysicalFiles.AddAsync(physicalFile, ct);
                await _db.SaveChangesAsync(ct);

                return ServiceResult<UploadResultDTO>.Success(new UploadResultDTO
                {
                    FileId = physicalFile.Id,
                    URL = $"/files/{storagePath}"
                });
            }
            catch (Exception ex)
            {
                return ServiceResult<UploadResultDTO>.Failure(ex.Message);
            }
        }

        public async Task<ServiceResult<FileServeDTO>> ServeFile(string storagePath, CancellationToken ct = default)
        {
            try
            {
                var physicalFile = await _db.PhysicalFiles
                    .FirstOrDefaultAsync(f => f.StoragePath == storagePath, ct);

                if (physicalFile is null)
                    return ServiceResult<FileServeDTO>.Failure("File not found", 404);

                var fullPath = $"{_basePath}/{physicalFile.StoragePath}";

                if (!File.Exists(fullPath))
                    return ServiceResult<FileServeDTO>.Failure("File not found on disk", 404);

                var stream = new FileStream(fullPath, FileMode.Open, FileAccess.Read, FileShare.Read,
                    bufferSize: 4096, useAsync: true);

                return ServiceResult<FileServeDTO>.Success(new FileServeDTO
                {
                    Stream = stream,
                    MimeType = physicalFile.MimeType,
                    OriginalFileName = physicalFile.FileName
                });
            }
            catch (Exception ex)
            {
                return ServiceResult<FileServeDTO>.Failure(ex.Message);
            }
        }

        public async Task<ServiceResult> DeleteFile(string userId, Guid fileId, CancellationToken ct = default)
        {
            try
            {
                var fileRecord = await _db.PhysicalFiles.Where(x => x.Id == fileId).FirstOrDefaultAsync(ct);

                if (fileRecord is null)
                    return ServiceResult<FileServeDTO>.Failure("File not found");

                if (fileRecord.OwnerId != userId)
                    return ServiceResult.Failure("Unauthorized");

                var fullPath = $"{_basePath}/{fileRecord.StoragePath}";

                if (File.Exists(fullPath))
                {
                    File.Delete(fullPath);
                }

                _db.PhysicalFiles.Remove(fileRecord);
                await _db.SaveChangesAsync(ct);

                return ServiceResult.Success();

            }
            catch (IOException ex)
            {
                return ServiceResult.Failure($"IO Error: {ex.Message}");
            }
            catch (Exception ex)
            {
                return ServiceResult.Failure($"Delete failed: {ex.Message}");
            }

        }

        public async Task<ServiceResult> ChangeProfilePicture(string userId, IFormFile file, CancellationToken ct = default)
        {
            try
            {
                var user = await _db.Users.Where(x => x.Id == userId).FirstOrDefaultAsync(ct);

                if (user is null)
                {
                    return ServiceResult.NotFound($"User not found");
                }

                if (user.ProfilePictureId is not null)
                {
                    var res = await DeleteFile(userId, user.ProfilePictureId.Value, ct);
                    if (!res.Succeded)
                    {
                        return ServiceResult.Failure($"Failed to delete profile picture");
                    }
                }

                var newPicture = await UploadFile(file, userId, "profile_pictures", UploadType.Image, ct);
                if (!newPicture.Succeded || newPicture.Data is null)
                {
                    return ServiceResult.Failure(newPicture.Error ?? "", newPicture.StatusCode);
                }

                user.ProfilePictureId = newPicture.Data.FileId;

                _db.Users.Update(user);
                await _db.SaveChangesAsync(ct);

                return ServiceResult.Success();
            }
            catch (Exception ex)
            {
                return ServiceResult.Failure(ex.Message);
            }
        }

        public async Task<ServiceResult> ChangeCourseIconPicture(string userId, Guid courseId, IFormFile file, CancellationToken ct = default)
        {
            try
            {
                var course = await _db.CourseBases.Where(x => x.Id == courseId).FirstOrDefaultAsync(ct);

                if (course is null)
                {
                    return ServiceResult.NotFound($"Course not found");
                }

                if (course.IconImageId is not null)
                {
                    var res = await DeleteFile(userId, course.IconImageId.Value, ct);
                    if (!res.Succeded)
                    {
                        return ServiceResult.Failure($"Failed to delete course icon picture");
                    }
                }

                var newPicture = await UploadFile(file, userId, "course_icon_pictures", UploadType.Image, ct);
                if (!newPicture.Succeded || newPicture.Data is null)
                {
                    return ServiceResult.Failure(newPicture.Error ?? "", newPicture.StatusCode);
                }

                course.IconImageId = newPicture.Data.FileId;

                _db.CourseBases.Update(course);
                await _db.SaveChangesAsync(ct);

                return ServiceResult.Success();
            }
            catch (Exception ex)
            {
                return ServiceResult.Failure(ex.Message);
            }
        }

        public async Task<ServiceResult> ChangeCourseBannerPicture(string userId, Guid courseId, IFormFile file, CancellationToken ct = default)
        {
            try
            {
                var course = await _db.CourseBases.Where(x => x.Id == courseId).FirstOrDefaultAsync(ct);

                if (course is null)
                {
                    return ServiceResult.NotFound($"Course not found");
                }

                if (course.BannerImageId is not null)
                {
                    var res = await DeleteFile(userId, course.BannerImageId.Value, ct);
                    if (!res.Succeded)
                    {
                        return ServiceResult.Failure($"Failed to delete course banner picture");
                    }
                }

                var newPicture = await UploadFile(file, userId, "course_banner_pictures", UploadType.Image, ct);
                if (!newPicture.Succeded || newPicture.Data is null)
                {
                    return ServiceResult.Failure(newPicture.Error ?? "", newPicture.StatusCode);
                }

                course.BannerImageId = newPicture.Data.FileId;

                _db.CourseBases.Update(course);
                await _db.SaveChangesAsync(ct);

                return ServiceResult.Success();
            }
            catch (Exception ex)
            {
                return ServiceResult.Failure(ex.Message);
            }
        }
    }
}
