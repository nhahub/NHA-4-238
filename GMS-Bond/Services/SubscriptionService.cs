using GMS_Bond.DTOs;
using GMS_Bond.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Runtime.CompilerServices;

namespace GMS_Bond.Services
{
    public class SubscriptionService : ISubscriptionService
    {
        private readonly ISubscriptionRepository _subscriptionRepository;
        private readonly IMemberRepository _memberRepository;
        private readonly IPackageRepository _packageRepository;
        private readonly IPlanRepository _planRepository;
        public SubscriptionService(ISubscriptionRepository subscriptionRepository , IMemberRepository memberRepository,
            IPackageRepository packageRepository , IPlanRepository planRepository) 
        {
            _subscriptionRepository = subscriptionRepository;
            _memberRepository = memberRepository;
            _packageRepository = packageRepository;
            _planRepository = planRepository;
        }

        public ApiResponse<List<SubscriptionDto>> GetSubscriptions()
        {
            var data = _subscriptionRepository.GetAll()
                .OrderByDescending(s => s.StartDate)
                .Select(s => new SubscriptionDto
                {
                    Id = s.Id,
                    MemberName = s.Member == null ?
                    string.Empty : $"{s.Member.Account.FirstName} {s.Member.Account.LastName}",
                    Email = (s.Member != null ? s.Member.Account.Email : string.Empty),
                    PlanName = s.Package!.Plan.Title,
                    StartDate = s.StartDate.ToString("yyyy-MM-dd"),
                    EndDate = s.EndDate.ToString("yyyy-MM-dd"),
                    Status = s.EndDate >= DateTime.UtcNow ? "Active" : "Expired",
                    Paid = s.Paid
                })
                .ToList()
                ;
            return ApiResponse<List<SubscriptionDto>>.Ok(data);
        }

        public async Task<ApiResponse<SubscriptionDto?>> CreateSubscription(CreateSubscriptionDto dto)
        {
            var member = await _memberRepository.GetAll()
                .Include(m => m.Account)
                .Where(m => m.MemberId == dto.MemberId)
                .FirstOrDefaultAsync();

            if (member == null)
                return ApiResponse<SubscriptionDto?>.NotFound("Member not found");
            var package = await _packageRepository
                .GetAll()
                .Where(pk => pk.Id == dto.PackageId)
                .Include(pk => pk.Plan)
                .ThenInclude(p => p.TrainingAppointments)
                .FirstOrDefaultAsync();

            if (package == null)
                return ApiResponse<SubscriptionDto?>.NotFound("Package not found");

            if (await HasActiveSubscription(dto.MemberId, package.PlanId))
                return ApiResponse<SubscriptionDto?>.Fail("Member has active subscription to this plan");

            if(await HasConflictAppointments(member.MemberId, package.Plan.TrainingAppointments.ToList()))
                return ApiResponse<SubscriptionDto?>.Fail("Member has conflicted appointments with this plan appointments");

            var subscription = new Subscription
            {
                StartDate = DateTime.UtcNow,
                EndDate = DateTime.UtcNow.AddMonths(package.NumberOfMonthes),
                Member = member,
                Package = package,
                Paid = package.Price
            };

            bool result = await _subscriptionRepository.AddAsync(subscription);
            if (!result)
                return ApiResponse<SubscriptionDto?>.Fail("Error creating subscription");
            await _subscriptionRepository.SaveAsync();
            var data = new SubscriptionDto
            {
                Id = subscription.Id,
                StartDate = subscription.StartDate.ToString("yyyy-MM-dd"),
                EndDate = subscription.EndDate.ToString("yyyy-MM-dd"),
                MemberName = member.Account.FirstName + " " + member.Account.LastName,
                Email = member.Account.Email,
                PlanName = package.Plan.Title,
                Status = subscription.EndDate >= DateTime.UtcNow ? "Acitve" : "Expired",
                Paid = subscription.Paid
            };

            return ApiResponse<SubscriptionDto?>.Ok(data);
        }

        public async Task<ApiResponse<List<SubscriptionDto>>> MemberSubscriptions(int memberId)
        {
            var member = await _memberRepository.GetByIdAsync(memberId);
            if (member == null)
                return ApiResponse<List<SubscriptionDto>>.NotFound("Member not found");

            var data = await _subscriptionRepository.GetAll()
                .Where(sub => sub.MemberId == memberId)
                .Select(sub => new SubscriptionDto
                {
                    Id = sub.Id,
                    PlanName = sub.Package != null ? sub.Package.Plan.Title : "",
                    StartDate = sub.StartDate.ToString("yyyy-MM-dd"),
                    EndDate = sub.EndDate.ToString("yyyy-MM-dd"),
                    Paid = sub.Paid,
                    Status = sub.EndDate >= DateTime.Now ? "Active" : "Expired"
                }).ToListAsync();

            return ApiResponse<List<SubscriptionDto>>.Ok(data);
        }
    
        private async Task<bool> HasActiveSubscription(int memberId , int planId)
        {
            return await _subscriptionRepository.GetAll()
                .Where(sub=>sub.MemberId == memberId && sub.Package != null && sub.Package.PlanId == planId 
                && sub.StartDate <= DateTime.Now && sub.EndDate > DateTime.Now)
                .AnyAsync();
        }

        private async Task<bool> HasConflictAppointments(int memberId,List<TrainingAppointment> trainingAppointments)
        {
            var newAppointments = trainingAppointments
                .Select(a => (a.Day, a.Time))
                .ToHashSet();

            var existingAppointments = await _subscriptionRepository.GetAll()
                .Where(sub =>
                    sub.MemberId == memberId &&
                    sub.StartDate <= DateTime.Today &&
                    sub.EndDate >= DateTime.Today && sub.Package != null)
                .SelectMany(sub => sub.Package!.Plan.TrainingAppointments)
                .ToListAsync();

            foreach (var appointment in existingAppointments)
            {
                if (newAppointments.Contains((appointment.Day, appointment.Time)))
                    return true;
            }

            return false;
        }
    
    }
}
