using System.ComponentModel.DataAnnotations;

namespace IronCore.DTOs
{
    public class PackageDto
    {
        public required int Id { get; set; }
        public required string Title { get; set; } = null!;
        public required string Description { get; set; } = null!;
        public required decimal Price { get; set; }
        public required int NumberOfMonthes { get; set; }
        public required int NumberOfSessions { get; set; }
        public required int? PlanId { get; set; }
        public required string? PlanTitle { get; set; }
        public string? Sport { get; set; } // for lists only
    }
}
