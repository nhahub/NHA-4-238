using IronCore.DTOs;

namespace IronCore.Services
{
    public interface ISubscriptionService
    {
        ApiResponse<List<SubscriptionDto>> GetSubscriptions();
        Task<ApiResponse<SubscriptionDto?>> CreateSubscription(CreateSubscriptionDto dto);
        Task<ApiResponse<List<SubscriptionDto>>> MemberSubscriptions(int memberId);
    }
}
