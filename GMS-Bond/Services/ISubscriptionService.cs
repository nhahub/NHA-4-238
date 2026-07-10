using GMS_Bond.DTOs;

namespace GMS_Bond.Services
{
    public interface ISubscriptionService
    {
        ApiResponse<List<SubscriptionDto>> GetSubscriptions();
        Task<ApiResponse<SubscriptionDto?>> CreateSubscription(CreateSubscriptionDto dto);
        Task<ApiResponse<List<SubscriptionDto>>> MemberSubscriptions(int memberId);
    }
}
