using GMS_Bond.DTOs;
using GMS_Bond.Repository;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using System.Diagnostics.CodeAnalysis;

namespace GMS_Bond.Services
{
    public class SessionService : ISessionService
    {
        private readonly ISessionRepository _sessionRepository;
        private readonly IMemberRepository _memberRepository;
        private readonly ISubscriptionRepository _subscriptionRepository;
        private readonly IPlanRepository _planRepository;

        public SessionService(ISessionRepository sessionRepository, IMemberRepository memberRepository
            , ISubscriptionRepository subscriptionRepository, IPlanRepository planRepository)
        {
            _sessionRepository = sessionRepository;
            _memberRepository = memberRepository;
            _subscriptionRepository = subscriptionRepository;
            _planRepository = planRepository;
        }
        public async Task<ApiResponse<AttendSessionDto>> AttendSession(AttendSessionDto dto)
        {

            var session = await _sessionRepository.GetByIdAsync(dto.SessionId);
            if (session == null)
                return ApiResponse<AttendSessionDto>.NotFound("Session is not found");

            var member = await _memberRepository.GetAll()
               .Include(m => m.Subscriptions)
                .ThenInclude(s => s.Package)
                .Where(m => m.MemberId == dto.MemberId)
                .FirstOrDefaultAsync();

            if (member == null)
                return ApiResponse<AttendSessionDto>.NotFound("Member is not found");



            bool validSubscription = member.Subscriptions
                .Any(s => s.Package != null && s.Package.PlanId == session.PlanId &&
                s.EndDate >= session.SessionDate && s.StartDate <= session.SessionDate);

            if (!validSubscription)
                return ApiResponse<AttendSessionDto>.Fail("Member does not have valid subscription");

            var sessionAttendance = new SessionAttendace()
            {
                MemberId = dto.MemberId,
                SessionId = dto.SessionId,
            };

            bool sessionAttended = (await _sessionRepository.GetSessionAttendaceAsync(sessionId: dto.SessionId, memberId: dto.MemberId)
                != null);

            if (sessionAttended)
                return ApiResponse<AttendSessionDto>.Fail("Member already attended this session");

            bool result = await _sessionRepository.AttendSessionAsync(sessionId: dto.SessionId, memberId: dto.MemberId);

            if (!result)
                return ApiResponse<AttendSessionDto>.Fail("Error while adding attendance");

            await _sessionRepository.SaveAsync();
            return ApiResponse<AttendSessionDto>.Ok(null);


        }

        public async Task<List<TodaySessionDto>> TodaySessions()
        {
            var today = DateTime.Today;
            var tomorrow = today.AddDays(1);
            var sessions = _sessionRepository.GetAll()
                .Where(s => s.SessionDate >= today && s.SessionDate < tomorrow)
                .Select(s => new SessionDto
                {
                    SessionId = s.Id,
                    PlanId = s.PlanId,
                    Time = s.SessionDate.ToShortTimeString(),
                    PlanName = s.Plan.Title,
                    TrainerName = s.Plan.Trainer.Name
                }).ToList();

            var sessionIds = sessions.Select(s => s.SessionId).ToList();
            var attendanceSet = (await _sessionRepository.GetAllAttendances()
                                .Where(a => sessionIds.Contains(a.SessionId))
                                .Select(a => new { a.SessionId, a.MemberId })
                                .ToListAsync())
                                .Select(a => (a.SessionId, a.MemberId))
                                .ToHashSet();

            var activeSubscriptions = _subscriptionRepository.GetAll()
                .Where(sub => sub.EndDate > today && sub.Package != null && sub.Member != null)
                // prevent if any ovelapping subscriptions for member
                .Select(sub => new
                {
                    sub.Package!.PlanId,
                    Member = new MemberAttendanceDto
                    {
                        Id = sub.MemberId!.Value,
                        Name = sub.Member!.Account.FirstName + " " + sub.Member!.Account.LastName,
                        PhoneNumber = sub.Member.Account.PhoneNumber!,
                        Attended = false
                    }
                }).ToList();
               // .DistinctBy(sub => sub.Member.Id);



            var data = new List<TodaySessionDto>();

            foreach (var ses in sessions)
            {
                data.Add(new TodaySessionDto
                {
                    SessionId = ses.SessionId,
                    Time = ses.Time,
                    PlanId = ses.PlanId,
                    PlanName = ses.PlanName,
                    TrainerName = ses.TrainerName,
                    Members = activeSubscriptions
            .Where(sub => sub.PlanId == ses.PlanId)
            .Select(sub => new MemberAttendanceDto
            {
                Id = sub.Member.Id,
                Name = sub.Member.Name,
                PhoneNumber = sub.Member.PhoneNumber,

                // HERE
                Attended = attendanceSet.Contains((ses.SessionId, sub.Member.Id))
            })
            .ToList()
                });
            }
            return data;
        }

        public async Task<ApiResponse<List<TodaySessionDto>>> GetTodaySessions()
        {
            var data = await TodaySessions();      
            return ApiResponse<List<TodaySessionDto>>.Ok(data);
        }

        public async Task<ApiResponse<int>> AddNextSessions(int days)
        {
            DateTime start = DateTime.Today;
            DateTime end = new DateTime(DateOnly.FromDateTime(start.AddDays(days)), new TimeOnly(23,59,59));
            var plans = _planRepository.GetAll().Include(p => p.TrainingAppointments).ToList();
            var sessionSet =  _sessionRepository.GetAll()
                .Where(s => s.SessionDate >= start && s.SessionDate <= end)
                .AsEnumerable()
                .Select(s => (s.PlanId, s.SessionDate))
                .ToHashSet();
            for (int i = 0; i <= days; i++)
            {
                DateTime day = start.AddDays(i);
                foreach (var plan in plans)
                {
                    foreach (var appointment in plan.TrainingAppointments)
                    {
                        if (appointment.Day == day.DayOfWeek)
                        {
                            DateTime sessionDate = new DateTime(DateOnly.FromDateTime(day), appointment.Time);
                            if (!sessionSet.Contains((plan.Id, sessionDate)))
                            {
                                var newSession = new Session
                                {
                                    PlanId = plan.Id,
                                    SessionDate = sessionDate
                                };
                                await _sessionRepository.AddAsync(newSession);
                                sessionSet.Add((newSession.PlanId , newSession.SessionDate));
                            }
                        }
                    }
                }
            }
            int rowsAffected = await _sessionRepository.SaveAsync();
            return ApiResponse<int>.Ok(rowsAffected);
        }

        
    }
}
