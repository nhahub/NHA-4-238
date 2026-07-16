namespace IronCore.DTOs
{
    public class TrainerDto
    {
        public required int Id { get; set; }
        public required string Name { get; set; } = "";
        public required string Title { get; set; } = "";
        public required string Description { get; set; } = "";
        public required int YearsOfExperience { get; set; }
        public required string? ImageUrl { get; set; }  = "";
        public required string? Sport { get; set; } = "";
        public required int? SportId { get; set; }
   }
}
