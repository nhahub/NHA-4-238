namespace GMS_Bond.Repository
{
    public class SubscriptionRepository : Repository<Subscription , int>, ISubscriptionRepository
    {
        public SubscriptionRepository(AcadamyContext context) : base(context)
        {
        }
    }
}
