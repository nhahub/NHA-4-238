using IronCore.DTOs;
using IronCore.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Runtime.CompilerServices;

namespace IronCore.Services
{
    public class SportService : ISportService
    {
        private readonly ISportRepository _sportRepository;
        private readonly IImageService _imageService;
        public SportService(ISportRepository sportRepository, IImageService imageService)
        {
            _sportRepository = sportRepository;
            _imageService = imageService;
        }

        public async Task<ApiResponse<List<SportDto>>> GetSportsList()
        {
            var data = await _sportRepository.GetAll().Select(s => new SportDto
            {
                Id = s.Id,
                Name = s.Name,
                Description = s.Description,
                ImageUrl = s.ImagePath
            }).ToListAsync();

            return ApiResponse<List<SportDto>>.Ok(data);
        }

        string[] allowedImageExtensions = [".jpg", ".jpeg", ".png"];
        public async Task<ApiResponse<SportDto?>> AddSport(AddSportDto dto)
        {
            if (dto.Image.Length > 5 * 1024 * 1024)
                return ApiResponse<SportDto?>.ValidationError(message: "File size should not exceed 5 MB");

            string createdImageName;
            try
            {
                createdImageName = await _imageService.SaveFileAsync(dto.Image, allowedImageExtensions);
            }
            catch (Exception ex)
            {
                return ApiResponse<SportDto?>.Fail(ex.Message);
            }

            var sport = new Sport
            {
                Name = dto.Name,
                Description = dto.Description,
                ImagePath = createdImageName
            };

            bool result = await _sportRepository.AddAsync(sport);
            if (!result)
                return ApiResponse<SportDto?>.Fail("Error creating sport");

            await _sportRepository.SaveAsync();
            var data = new SportDto
            {
                Id = sport.Id,
                Name = sport.Name,
                Description = sport.Description,
                ImageUrl = sport.ImagePath
            };
            return ApiResponse<SportDto?>.Created(data);
        }

        public async Task<ApiResponse<SportDto?>> UpdateSport(int sportId, UpdateSportDto dto)
        {
            var sport = await _sportRepository.GetByIdAsync(sportId);
            if (sport == null)
                return ApiResponse<SportDto?>.NotFound("Sport not found");

            
            if (dto.Image != null)
            {
                if (dto.Image.Length > 5 * 1024 * 1024)
                    return ApiResponse<SportDto?>.ValidationError(message: "File size should not exceed 5 MB");
                try
                {
                    string createdImageName = await _imageService.SaveFileAsync(dto.Image, allowedImageExtensions);
                    _imageService.DeleteFile(sport.ImagePath);
                    sport.ImagePath = createdImageName;
                    
                }
                catch (Exception ex)
                {
                    return ApiResponse<SportDto?>.Fail(ex.Message);
                }
            }

            sport.Name = dto.Name;
            sport.Description = dto.Description;

            bool result = await _sportRepository.UpdateAsync(sport);
            if (!result)
                return ApiResponse<SportDto?>.Fail("Error updating Sport");

            await _sportRepository.SaveAsync();
            var data = new SportDto
            {
                Id = sport.Id,
                Name = sport.Name,
                Description = sport.Description,
                ImageUrl = sport.ImagePath
            };
            return ApiResponse<SportDto?>.Ok(data);

        }

        public async Task<ApiResponse<SportDto?>> DeleteSport(int sportId)
        {
            var sport = await _sportRepository.GetByIdAsync(sportId);
            if (sport == null)
                return ApiResponse<SportDto?>.NotFound("Sport not found");

            string image = sport.ImagePath;
            bool result = await _sportRepository.DeleteAsync(sportId);
            if (!result)
                return ApiResponse<SportDto?>.Fail("Error deleting sport");
            
            _imageService.DeleteFile(image);
            await _sportRepository.SaveAsync();
            return  ApiResponse<SportDto?>.Ok(null);
        }

        public async Task<ApiResponse<SportDto?>> GetSport(int sportId) 
        {
            var sport = await _sportRepository.GetByIdAsync(sportId);
            if (sport == null)
                return ApiResponse<SportDto?>.NotFound("Sport not found");
            var data = new SportDto
            {
                Id = sport.Id,
                Name = sport.Name,
                Description = sport.Description,
                ImageUrl = sport.ImagePath
            };
            return ApiResponse<SportDto?>.Ok(data);
    }
    }

}
