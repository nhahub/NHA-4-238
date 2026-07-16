namespace IronCore.Repository
{
    public interface ISessionRepository : IRepository<Session , int>
    {
        Task<bool> AttendSessionAsync(int sessionId , int memberId);
        Task<SessionAttendace?> GetSessionAttendaceAsync(int sessionId , int memberId);
        IQueryable<SessionAttendace> GetAllAttendances();
        Task<bool> IsSessionExist(DateTime date, int planId);
        //Task<bool> AddAsync(DateTime date, int planId);

    }
}
