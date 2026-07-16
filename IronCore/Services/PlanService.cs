using IronCore.DTOs;
using IronCore.Repository;
using Microsoft.EntityFrameworkCore;

namespace IronCore.Services
{
    public class PlanService : IPlanService
    {
        private readonly IPlanRepository _planRepository;
        private readonly ISportRepository _sportRepository;
        private readonly ITrainerRepository _trainerRepository;
        public PlanService(IPlanRepository planRepository, ISportRepository sportRepository, ITrainerRepository trainerRepository)
        {
            _planRepository = planRepository;
            _sportRepository = sportRepository;
            _trainerRepository = trainerRepository;

        }
        public ApiResponse<List<PlanDto>> GetPlans()
        {
            List<PlanDto> plans = _planRepository.GetAll()
                .Select(p => new PlanDto{

                    Id = p.Id,
                    Title = p.Title, 
                    Description = p.Description,
                    TrainerName = p.Trainer.Name,
                    Sport = p.Sport.Name, 
                    Appointments = p.TrainingAppointments.
                    Select(tp => new TrainingAppointmentDto()
                    { 
                        Day = tp.Day,
                        Time = tp.Time
                    }).ToList() }
                ).ToList();

            return ApiResponse<List<PlanDto>>.Ok(plans);
        }

        public ApiResponse<List<PlanDto>> GetPlansBySport(int sportId)
        {
            List<PlanDto> plans = _planRepository.GetAll()
               .Where(p => p.SportId == sportId)
               .Select(p => new PlanDto
               {

                   Id = p.Id,
                   Title = p.Title,
                   Description = p.Description,
                   TrainerName = p.Trainer.Name,
                   Sport = p.Sport.Name,
                   Appointments = p.TrainingAppointments.
                   Select(tp => new TrainingAppointmentDto()
                   {
                       Day = tp.Day,
                       Time = tp.Time
                   }).ToList()
               }
               ).ToList();


            return ApiResponse<List<PlanDto>>.Ok(plans);
        }

        public async Task<ApiResponse<PlanDto?>> GetPlan(int planId)
        {
            var plan = await _planRepository.GetByIdAsync(planId);
            if (plan == null)
                return ApiResponse<PlanDto?>.NotFound("Plan not found");

            var trainer = await _trainerRepository.GetByIdAsync(plan.TrainerId);
            var sport = await _sportRepository.GetByIdAsync(plan.SportId);
            var appointments =  _planRepository.GetTrainingAppointmentsByPlanAsync(planId);

            var data = new PlanDto
            {
                Id = plan.Id,
                Title = plan.Title,
                Description = plan.Description,
                SportId = sport!.Id,
                TrainerId = trainer!.Id,
                TrainerName = trainer.Name,
                Sport = sport!.Name,
                Appointments = appointments.Select(tp => new TrainingAppointmentDto()
                {
                    Day = tp.Day,
                    Time = tp.Time
                }).ToList()

            };
            return ApiResponse<PlanDto?>.Ok(data);
        }

        public async Task<ApiResponse<PlanDto?>> AddPlan(AddUpdatePlanDto dto)
        {
            var sport = await _sportRepository.GetByIdAsync(dto.SportId);
            if (sport == null)
                return ApiResponse<PlanDto?>.NotFound("Sport is not found");

            var trainer = await _trainerRepository.GetByIdAsync(dto.TrainerId);
            if (trainer == null)
                return ApiResponse<PlanDto?>.NotFound("Trainer is not found");

            Plan plan = new()
            {
                Title = dto.Title,
                Description = dto.Description,
                TrainerId = dto.TrainerId,
                SportId = dto.SportId,
            };

            foreach (var appointment in dto.Appointments)
            {
                plan.TrainingAppointments.Add(new TrainingAppointment
                {
                    Day = appointment.Day,
                    Time = appointment.Time
                });
            }

            bool result = await _planRepository.AddAsync(plan);
            if (!result)
                return ApiResponse<PlanDto?>.Fail("Error adding plan");

            await _planRepository.SaveAsync();
            var data = new PlanDto
            {
                Id = plan.Id,
                Title = plan.Title,
                Description = plan.Description,
                TrainerId=trainer.Id,
                TrainerName = trainer.Name,
                Sport = sport.Name,
                SportId =sport.Id,
                Appointments = dto.Appointments
            };
            return ApiResponse<PlanDto?>.Created(data);

        }

        public async Task<ApiResponse<PlanDto?>> UpdatePlan(int planId, AddUpdatePlanDto dto)
        {
            var plan = await _planRepository.GetByIdAsync(planId);
            if (plan == null)
                return ApiResponse<PlanDto?>.NotFound("Plan not found");

            var sport = await _sportRepository.GetByIdAsync(dto.SportId);
            if (sport == null)
                return ApiResponse<PlanDto?>.NotFound("Sport is not found");

            var trainer = await _trainerRepository.GetByIdAsync(dto.TrainerId);
            if (trainer == null)
                return ApiResponse<PlanDto?>.NotFound("trainer is not found");

            plan.Title = dto.Title;
            plan.Description = dto.Description;
            plan.SportId = dto.SportId;
            plan.TrainerId = dto.TrainerId;
             _planRepository.DeleteAllPlanAppointments(planId);

            plan.TrainingAppointments = dto.Appointments.Select(a => new TrainingAppointment()
            {
                Day = a.Day,
                Time = a.Time
            }).ToHashSet();

            bool result = await _planRepository.UpdateAsync(plan);
            if (!result)
                return ApiResponse<PlanDto?>.Fail("Error in updating plan");

            await _planRepository.SaveAsync();
            var data = new PlanDto
            {
                Id = plan.Id,
                Title = plan.Title,
                Description = plan.Description,
                TrainerId = trainer.Id,
                TrainerName = trainer.Name,
                Sport = sport.Name,
                SportId = sport.Id,
                Appointments = dto.Appointments
            };
            return ApiResponse<PlanDto?>.Created(data);
        }

        public async Task<ApiResponse<PlanDto?>> DeletePlan(int planId)
        {
            bool result = await _planRepository.DeleteAsync(planId);
            if (!result)
                return ApiResponse<PlanDto?>.Fail("Error in deleting plan");
            await _planRepository.SaveAsync();
            return ApiResponse<PlanDto?>.Ok(null);
        }



    }
}
