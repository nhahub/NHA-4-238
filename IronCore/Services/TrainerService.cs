using IronCore.DTOs;
using IronCore.Repository;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;

namespace IronCore.Services
{
    public class TrainerService : ITrainerService
    {
        private readonly IImageService _imageService;
        private readonly ITrainerRepository _trainerRepository;
        public TrainerService(IImageService imageService, ITrainerRepository trainerRepository)
        {
            _imageService = imageService;
            _trainerRepository = trainerRepository;
        }

        string[] allowedImageExtensions = [".jpg", ".jpeg", ".png"];
        public async Task<ApiResponse<TrainerDto?>> AddTrainer(AddTrainerDto dto)
        {
            if (dto == null)
                return ApiResponse<TrainerDto?>.Fail("Invalid Data");

            string createdImageName;

            if (dto.Image?.Length > 5 * 1024 * 1024)
                return ApiResponse<TrainerDto?>.ValidationError(message: "File size should not exceed 5 MB");

            try
            {
                createdImageName = await _imageService.SaveFileAsync(dto.Image!, allowedImageExtensions);
            }
            catch (Exception ex)
            {
                return ApiResponse<TrainerDto?>.Fail(ex.Message);
            }


            var trainer = new Trainer
            {
                Name = dto.Name,
                Title = dto.Title,
                Description = dto.Description,
                YearsOfExperience = dto.YearsOfExperience,
                ImagePath = createdImageName,
                SportId = dto.SportId
            };

            bool result = await _trainerRepository.AddAsync(trainer);
            if (!result)
                return ApiResponse<TrainerDto?>.Fail("Error adding the trainer");

            var data = new TrainerDto
            {
                Id = trainer.Id,
                Name = trainer.Name,
                Title = trainer.Title,
                Description = trainer.Description,
                YearsOfExperience = trainer.YearsOfExperience,
                ImageUrl = trainer.ImagePath,
                Sport = (trainer.Sport == null ? null : trainer.Sport.Name),
                SportId = trainer.SportId
            };

            await _trainerRepository.SaveAsync();
            return ApiResponse<TrainerDto?>.Created(data , "Trainer added successfully");

        }

        public async Task<ApiResponse<TrainerDto?>> UpdateTrainer(int trainerId , UpdateTrainerDto dto)
        {
            if (dto == null)
                return ApiResponse<TrainerDto?>.Fail("Invalid Data");

            var trainer = await _trainerRepository.GetByIdAsync(trainerId);
            if (trainer == null)
                return ApiResponse<TrainerDto?>.NotFound("Trainer not found");
            
            if(dto.Image != null)
            {
                if (dto.Image?.Length > 1 * 1024 * 1024)
                    return ApiResponse<TrainerDto?>.Fail("File size should not exceed 1 MB");
                try
                {
                    string createdImage = await _imageService.SaveFileAsync(dto.Image!, allowedImageExtensions);
                    _imageService.DeleteFile(trainer.ImagePath);
                    trainer.ImagePath = createdImage;
                }
                catch(Exception ex) 
                {
                    return ApiResponse<TrainerDto?>.Fail(ex.Message);
                }
            }

            trainer.Name = dto.Name;
            trainer.Title = dto.Title;
            trainer.Description = dto.Description;
            trainer.YearsOfExperience = dto.YearsOfExperience;
            trainer.SportId = dto.SportId;

            bool result = await _trainerRepository.UpdateAsync(trainer);
            if (!result)
                return ApiResponse<TrainerDto?>.Fail("Error in adding the trainer");

            await _trainerRepository.SaveAsync();

            var data = new TrainerDto
            {
                Id = trainer.Id,
                Name = trainer.Name,
                Title = trainer.Title,
                Description = trainer.Description,
                YearsOfExperience = trainer.YearsOfExperience,
                ImageUrl = trainer.ImagePath,
                Sport = (trainer.Sport == null ? null : trainer.Sport.Name),
                SportId = trainer.SportId
            };

            return ApiResponse<TrainerDto?>.Ok(data , "Trainer updated successfully");

        }

        public async Task<ApiResponse<TrainerDto?>> GetTrainer(int trainerId)
        {
            var trainer = await _trainerRepository.GetByIdAsync(trainerId);
            if (trainer == null) 
                return ApiResponse<TrainerDto?>.NotFound("Trainer not found");
            
            var data =  new TrainerDto
            {
                Id = trainerId,
                Name = trainer.Name,
                Title = trainer.Title,
                Description = trainer.Description,
                YearsOfExperience = trainer.YearsOfExperience,
                ImageUrl = trainer.ImagePath,
                Sport = (trainer.Sport == null ? null : trainer.Sport.Name),
                SportId= trainer.SportId
            };

            return ApiResponse<TrainerDto?>.Ok(data, "Trainer found successfully");
        }

        public async Task<ApiResponse<TrainerDto?>> DeleteTrainer(int trainerId) 
        {
            var trainer = await _trainerRepository.GetByIdAsync(trainerId);
            if(trainer == null)
                return ApiResponse<TrainerDto?>.NotFound("Trainer Not Found");

            string image = trainer.ImagePath;
            bool result = await _trainerRepository.DeleteAsync(trainerId);
            if (!result)
                return ApiResponse<TrainerDto?>.Fail("Error deleting trainer");

            _imageService.DeleteFile(image);
            await _trainerRepository.SaveAsync();
            return ApiResponse<TrainerDto?>.Ok(null , "Trainer deleted successfully");

        }

        public async Task<ApiResponse<List<TrainerDto>>> GetTrainersList()
        {
            List<TrainerDto> list = await _trainerRepository.GetAll().Select(t => new TrainerDto
            {
                Id = t.Id,
                Name = t.Name,
                Title = t.Title,
                Description = t.Description,
                YearsOfExperience = t.YearsOfExperience,
                ImageUrl = t.ImagePath,
                Sport = (t.Sport == null ? null : t.Sport.Name),
                SportId = t.SportId,
            }).ToListAsync();

            return ApiResponse<List<TrainerDto>>.Ok(list);
        }


    }


}

