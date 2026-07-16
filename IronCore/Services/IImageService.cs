using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace IronCore.Services
{
    public interface IImageService
    {
        Task<string> SaveFileAsync(IFormFile imageFile, string[] allowedExtensions);
        void DeleteFile(string fileNameWithExtension);
    }

    public class ImageService : IImageService
    {
        private readonly IWebHostEnvironment _environment;
        public ImageService(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        public async Task<string> SaveFileAsync(IFormFile imageFile, string[] allowedExtensions)
        {
            if (imageFile == null)
                throw new ArgumentNullException(nameof(imageFile));

            var contentPath = _environment.WebRootPath;
            var path = Path.Combine(contentPath, "uploads");
            
            if (!Directory.Exists(path))
                Directory.CreateDirectory(path);

            var ext = Path.GetExtension(imageFile.FileName);
            if (!allowedExtensions.Contains(ext))
                throw new ArgumentException($"Only {string.Join(",", allowedExtensions)} are allowed.");
            var fileName = $"{Guid.NewGuid().ToString()}{ext}";
            var fileNameWithPath = Path.Combine(path, fileName);
            using (var stream = new FileStream(fileNameWithPath, FileMode.Create))
            {
                await imageFile.CopyToAsync(stream);
                return fileName;
            }

        }

        public void DeleteFile(string fileNameWithExtension)
        {
            if(string.IsNullOrEmpty(fileNameWithExtension))
                throw new ArgumentNullException(nameof(fileNameWithExtension));

            var contentPath = _environment.WebRootPath;
            var path = Path.Combine(contentPath, $"uploads", fileNameWithExtension);

            if (!File.Exists(path))
                throw new FileNotFoundException($"Invalid file path");

            File.Delete(path);

        } 


    }
}



