namespace GMS_Bond.Repository
{
    public class SportRepository : Repository<Sport , int> , ISportRepository
    {
        public SportRepository(AcadamyContext context) : base(context) { } 
    }
}
