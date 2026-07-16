using IronCore.DTOs;
using IronCore.Repository;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;

namespace IronCore.Services
{

    public class AdminService : IAdminService
    {
        private readonly ISubscriptionRepository _subscriptionRepository;
        private readonly IMemberRepository _memberRepository;
        private readonly ITrainerRepository _trainerRepository;
        private readonly IPlanRepository _planRepository;
        private readonly IPackageRepository _packageRepository;
        private readonly ISessionService _sessionService;
        private readonly ISportRepository _sportRepository;

        public AdminService(ISubscriptionRepository subscriptionRepository , IMemberRepository memberRepository,
            ITrainerRepository trainerRepository, ISessionService sessionService , IPlanRepository planRepository
            ,IPackageRepository packageRepository , ISportRepository sportRepository)
        {
            _subscriptionRepository = subscriptionRepository;
            _memberRepository = memberRepository;
            _trainerRepository = trainerRepository;
            _sessionService = sessionService;
            _packageRepository = packageRepository;
            _planRepository = planRepository;
            _sportRepository = sportRepository;
        }

        private async Task<decimal> TotalRevenue()
        {
            return await _subscriptionRepository.GetAll()
                .SumAsync(sub => sub.Paid);
        }

        private async Task<int> TotalMembers()
        {
            return await _memberRepository.GetAll().CountAsync();
        }
        
        private async Task<int> ActiveSubscriptions()
        {
            return await _subscriptionRepository.GetAll()
                .Where(sub => sub.EndDate > DateTime.UtcNow && sub.StartDate <=  DateTime.UtcNow)
                .CountAsync();
        }

        private async Task<int> TotalTrainers()
        {
            return await _trainerRepository.GetAll().CountAsync();
        }

        private async Task<List<MonthlyRevenue>> MonthlyRevenue()
        {
            DateTime now = DateTime.Now;
            int currentMonth = now.Month;
            int currentYear = now.Year;

            var monthlyRevenues= new List<MonthlyRevenue>();
            
            var yearSubscriptions = await _subscriptionRepository.GetAll()
                .Where(sub => sub.StartDate >= new DateTime(currentYear, 1, 1))
                .ToListAsync();

            string[] months = { "Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" };

            for(int i = 1; i <= currentMonth; i++)
            {
                DateTime start = new DateTime(currentYear, i, 1);
                DateTime end = new DateTime(currentYear, i, DateTime.DaysInMonth(currentYear, i), 23, 59, 59);
                monthlyRevenues.Add(new MonthlyRevenue
                {
                    Month = months[i - 1],
                    Revenue = yearSubscriptions
                    .Where(sub => sub.StartDate >= start && sub.StartDate <= end)
                    .Sum(sub=>sub.Paid)
                });
            }

            return monthlyRevenues;
        }

        private async Task<int> TotalPlans()
        {
            return await _planRepository.GetAll().CountAsync();
        }

        private async Task<int> TotalPackages()
        {
            return await _packageRepository.GetAll().CountAsync();
        }
        
        private async Task<int> CurrentMonthNewSubscriptions()
        {
            DateTime now = DateTime.Now;
            DateTime month = new DateTime(now.Year , now.Month , 1);

            return await _subscriptionRepository.GetAll()
                .Where(sub => sub.StartDate >= month)
                .CountAsync();
        }

        private async Task<List<SportSubscribersDto>> SportSubscribers()
        {
             var activeSubscriptions= await _subscriptionRepository.GetAll()
                .Where(sub => sub.EndDate > DateTime.UtcNow && sub.StartDate <= DateTime.UtcNow && sub.Package != null)
                .Include(sub => sub.Package)
                .ThenInclude(pk => pk!.Plan)
                .ToListAsync();
                
            var sports = await _sportRepository.GetAll().ToListAsync();

          var sportSubscribers = new List<SportSubscribersDto>();
            foreach(var sport in sports)
            {
                sportSubscribers.Add(new SportSubscribersDto
                {
                    Sport = sport.Name,
                    ActiveSubscriptions = activeSubscriptions.Where(sub => sub.Package!.Plan.SportId == sport.Id).Count()
                });
            }
            return sportSubscribers;
        }

        private async Task<List<SubscriptionDto>> LastSubscriptions()
        {
            return await _subscriptionRepository.GetAll()
                .OrderByDescending(sub => sub.StartDate)
                .Select(sub => new SubscriptionDto
                {
                    Id = sub.Id,
                    MemberName = sub.Member == null ? "" :sub.Member.Account.FirstName + " " + sub.Member.Account.LastName,
                    Email = sub.Member== null ? "": sub.Member.Account.Email,
                    PlanName = sub.Package == null ? "" : sub.Package.Plan.Title,
                    StartDate = sub.StartDate.ToString("yyyy-MM-dd"),
                    EndDate = sub.EndDate.ToString("yyyy-MM-dd"),
                    Status = sub.EndDate > DateTime.Now ? "Active" : "Expired",
                    Paid = sub.Paid
                })
                .ToListAsync();
        }

        public async Task<ApiResponse<AdminDashboard>> AdminDashboard()
        {
            var data = new AdminDashboard
            {
                TotalRevenue = await TotalRevenue(),
                TotalMembers = await TotalMembers(),
                TotalPackages = await TotalPackages(),
                TotalPlans = await TotalPlans(),
                TotalTrainers = await TotalTrainers(),
                MonthlyRevenues = await MonthlyRevenue(),
                ActiveSubscriptions = await ActiveSubscriptions(),
                CurrentMonthSubscriptions = await CurrentMonthNewSubscriptions(),
                SportSubscribers = await SportSubscribers(),
                LastSubscriptions = await LastSubscriptions(),
                TodaySessionsList = await _sessionService.TodaySessions()
            };
            return ApiResponse<AdminDashboard>.Ok(data);
        }


    }
}
