namespace IronCore.DTOs
{
    public class SportDto
    {
        public int Id { get; set; }
        public required string Name { get; set; } 
        public required string Description { get; set; } 
        public required string ImageUrl { get; set; } 
    }
}
