using Microsoft.EntityFrameworkCore;

namespace GMS_Bond.Repository
{
    public class PlanRepository : Repository<Plan , int> , IPlanRepository
    {
        public PlanRepository(AcadamyContext context) : base(context) { }
        public List<TrainingAppointment> GetTrainingAppointmentsByPlanAsync(int planId)
        {
            return _context.TrainingAppointments.Where(tr => tr.PlanId == planId).ToList();
        }

        public void DeleteAllPlanAppointments(int planId) 
        {
            var appointments = _context.TrainingAppointments.Where(tr => tr.PlanId == planId);
            _context.TrainingAppointments.RemoveRange(appointments);
        }
    }
}
