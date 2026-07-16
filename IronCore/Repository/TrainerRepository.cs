namespace IronCore.Repository
{
    public class TrainerRepository : Repository<Trainer , int> , ITrainerRepository
    {
        public TrainerRepository(AcadamyContext context):base(context) { }
    }
}
