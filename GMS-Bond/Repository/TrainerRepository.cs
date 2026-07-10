namespace GMS_Bond.Repository
{
    public class TrainerRepository : Repository<Trainer , int> , ITrainerRepository
    {
        public TrainerRepository(AcadamyContext context):base(context) { }
    }
}
