using Microsoft.EntityFrameworkCore;

namespace IronCore.Repository
{
    public class SessionRepository : Repository<Session , int> , ISessionRepository
    {
        public SessionRepository(AcadamyContext context) : base(context) { }

        public async Task<bool> AttendSessionAsync(int sessionId , int memberId)
        {
            var sessionAttendance = new SessionAttendace
            {
                SessionId = sessionId,
                MemberId = memberId
            };
            await _context.SessionAttendaces.AddAsync(sessionAttendance); 
            return true;
        }

        public async Task<SessionAttendace?> GetSessionAttendaceAsync(int sessionId, int memberId)
        {
           SessionAttendace? sessionAttendace = await _context.SessionAttendaces.
                FirstOrDefaultAsync(sa => sa.SessionId == sessionId && sa.MemberId == memberId);
            return sessionAttendace;
        }

        public IQueryable<SessionAttendace> GetAllAttendances()
        {
            return _context.SessionAttendaces;
        }
        
        public async Task<bool> IsSessionExist(DateTime date, int planId)
        {
            Session? session = await _context.Sessions
                .Where(s => s.SessionDate == date &&  s.PlanId == planId)
                .FirstOrDefaultAsync();

            return session != null;
        }

        public async Task<bool> AddAsync(DateTime date, int planId)
        {
            Session session = new Session
            {
                SessionDate = date,
                PlanId = planId,
            };

            await _context.Sessions.AddAsync(session);
            return true;
        }
    }
}
