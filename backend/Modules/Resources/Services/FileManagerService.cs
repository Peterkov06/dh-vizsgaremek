using backend.Data;
using backend.Modules.Resources.DTOs;
using backend.Modules.Resources.Models;
using backend.Modules.Shared.Results;
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
            _basePath = config["FILES_BASE_PATH"] ?? "./files";
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
                var uploadPath = Path.Combine(_basePath, subFolder);
                Directory.CreateDirectory(uploadPath);
                var fullPath = Path.Combine(uploadPath, uniqueFilename);

                using (var stream = new FileStream(fullPath, FileMode.Create))
                    await file.CopyToAsync(stream, ct);

                var storagePath = Path.Combine(subFolder, uniqueFilename);

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
    }
}
