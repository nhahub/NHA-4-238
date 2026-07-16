using IronCore.DTOs;
using IronCore.Repository;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;

namespace IronCore.Services
{
    public class MemberService : IMemberService
    {
        private readonly IMemberRepository _memberRepository;
        private readonly ISessionRepository _sessionRepository;
        private readonly ISubscriptionRepository _subscriptionRepository;
        private readonly UserManager<UserAccount> _userManager;

        public MemberService(IMemberRepository memberRepository, ISessionRepository sessionRepository,
            ISubscriptionRepository subscriptionRepository , UserManager<UserAccount> userManager)
        {
            _memberRepository = memberRepository;
            _sessionRepository = sessionRepository;
            _subscriptionRepository = subscriptionRepository;
            _userManager = userManager;
        }

        private async Task<List<Session>> MemberMonthSessions(int memberId, int year , int month)
        {
            DateTime now = DateTime.Now;
            DateTime monthStart = new DateTime(year, month, 1);
            DateTime monthEnd = new DateTime(year, month, DateTime.DaysInMonth(year, month), 23, 59, 59);

            var activeSubscriptions = await _subscriptionRepository.GetAll()
                .Where(sub => sub.MemberId == memberId && sub.EndDate >= monthStart && sub.Package != null)
                .Include(sub => sub.Package)
                .ThenInclude(pk => pk!.Plan)
                .ToListAsync();

            var monthSessions = await _sessionRepository.GetAll()
                .Where(s => s.SessionDate >= monthStart && s.SessionDate <= monthEnd)
                .Include(s => s.Plan)
                .ThenInclude(p => p.Trainer)
                .ToListAsync();

            var memberSessions = new List<Session>();
            foreach (var subscription in activeSubscriptions)
            {
                var start = monthStart > subscription.StartDate ? monthStart : subscription.StartDate;
                var end = monthEnd < subscription.EndDate ? monthEnd : subscription.EndDate;
                memberSessions.AddRange(monthSessions
                    .Where(s => s.SessionDate >= start && s.SessionDate <= end && s.PlanId == subscription.Package!.PlanId));
            }

           return memberSessions.Distinct().OrderBy(s => s.SessionDate).ToList();
        }

        private MemberSessionsDto SessionToMemberSessionDto(Session session , HashSet<int>attendedSessionIds)
        {
            return new MemberSessionsDto
            {
                PlanId = session.PlanId,
                SessionId = session.Id,
                TrainerName = session.Plan.Trainer.Name,
                Date = session.SessionDate.ToString("yyyy-MM-dd"),
                Time = session.SessionDate.ToShortTimeString(),
                PlanName = session.Plan.Title,
                Attended = attendedSessionIds.Contains(session.Id)

            };
        }

        private async Task<HashSet<int>> MemberAttendedSessionIds(List<Session> memberSessions , int memberId)
        {
            var sessionIds = memberSessions.Select(s => s.Id).ToList();

            return await _sessionRepository.GetAllAttendances()
                .Where(a => sessionIds.Contains(a.SessionId) && a.MemberId == memberId)
                .Select(a => a.SessionId)
                .ToHashSetAsync();
        }

        public async Task<ApiResponse<MemberCalendarDto?>> MemberMonthCalendar(int memberId , int year , int month)
        {
            var member = await _memberRepository.GetByIdAsync(memberId);
            if (member == null)
                return ApiResponse<MemberCalendarDto?>.NotFound("Member not found");

            var memberSessions = await MemberMonthSessions(memberId , year ,month);

            var attendedSessionIds = await MemberAttendedSessionIds(memberSessions , memberId);

            var recent = memberSessions
                .Where(s => s.SessionDate <= DateTime.Now)
                .Select(s => SessionToMemberSessionDto(s , attendedSessionIds)).ToList();

            var upcoming = memberSessions
                .Where(s => s.SessionDate > DateTime.Now)
                .Select(s => SessionToMemberSessionDto(s, attendedSessionIds)).ToList();

            var data = new MemberCalendarDto
            {
                RecentSessions = recent,
                UpcomingSessions = upcoming
            };

            return ApiResponse<MemberCalendarDto?>.Ok(data);

        }

        private async Task<List<MonthlyActivity>> GetMonthlyActitvityAsync(int memberId)
        {
            

            DateTime now = DateTime.Now;
            int currentMonth = now.Month;
            int currentYear = now.Year;
            var monthlyActivity = new List<MonthlyActivity>();
            var memberAttendences = await _sessionRepository.GetAllAttendances()
                .Where(at => at.MemberId == memberId && at.Session.SessionDate >= new DateTime(currentYear,1,1))
                .Include(at => at.Session)
                .ToListAsync();
            string[] months = { "Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" };
            
            for (int i = 1; i <= currentMonth; i++)
            {
                DateTime start = new DateTime(currentYear , i , 1);
                DateTime end = new DateTime(currentYear, i, DateTime.DaysInMonth(currentYear, i), 23, 59, 59);
                int attendences = memberAttendences
                    .Where(at => at.Session.SessionDate <= end && at.Session.SessionDate >= start)
                    .Count();
                monthlyActivity.Add(new MonthlyActivity
                {
                    Month = months[i - 1],
                    NumberOfAttendedSessions = attendences,
                });
            }

            return monthlyActivity;
        }

        private async Task<int> ActiveSubscriptions(int memberId)
        {
            int activeSubscriptions = await _subscriptionRepository.GetAll()
                .Where(sub => sub.EndDate >= DateTime.Now && sub.MemberId == memberId).CountAsync();
            return activeSubscriptions;
        }
        
        private async Task<int> MonthAttendance(int memberId)
        {
           
            DateTime now = DateTime.Now;
            DateTime start = new DateTime(now.Year ,now.Month , 1);
            DateTime end = new DateTime(now.Year, now.Month, DateTime.DaysInMonth(now.Year, now.Month), 23, 59, 59);

            int attendance = _sessionRepository.GetAllAttendances()
                .Where(at => at.MemberId == memberId && at.Session.SessionDate >= start && at.Session.SessionDate <= end)
                .Count();
            return attendance;
        }

        private async Task<decimal> TotalSpend (int memberId)
        {
            return await _subscriptionRepository.GetAll()
                .Where(sub => sub.MemberId == memberId)
                .SumAsync(sub => sub.Paid);
        }

        public async Task<ApiResponse<MemberDashboard>> MemberDashboard(int memberId)
        {
            var member = await _memberRepository.GetByIdAsync(memberId);
            if (member == null)
                return ApiResponse<MemberDashboard>.NotFound("Member not found");

            var account = await _userManager.FindByIdAsync(memberId.ToString());

            var memberSessions = await MemberMonthSessions(memberId, DateTime.Today.Year, DateTime.Today.Month);

            var attendedSessionIds = await MemberAttendedSessionIds(memberSessions , memberId);

            var recent = memberSessions
                .Where(s => s.SessionDate <= DateTime.Now)
                .Select(s => SessionToMemberSessionDto(s, attendedSessionIds)).ToList();

            var upcoming = memberSessions
                .Where(s => s.SessionDate > DateTime.Now)
                .Select(s => SessionToMemberSessionDto(s, attendedSessionIds)).ToList();


            var data = new MemberDashboard
            {
                ActiveSubscriptions = await ActiveSubscriptions(memberId),
                JoinedBefore = DateTime.Now.Subtract(account!.CreatedAt).Days,
                MonthAttendance = await MonthAttendance(memberId),
                TotalSpend = await TotalSpend(memberId),
                MonthlyActivity = await GetMonthlyActitvityAsync(memberId),
                RecentSessions = recent,
                UpcomingSessions = upcoming
            };

            return ApiResponse<MemberDashboard>.Ok(data);
        }
    }
}
