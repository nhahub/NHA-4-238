namespace GMS_Bond.Repository
{
    public interface IPlanRepository : IRepository<Plan , int>
    {
        List<TrainingAppointment> GetTrainingAppointmentsByPlanAsync(int planId);
        void DeleteAllPlanAppointments(int planId);


    }
}
