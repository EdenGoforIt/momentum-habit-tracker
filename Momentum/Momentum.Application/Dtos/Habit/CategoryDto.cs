namespace Momentum.Application.Dtos.Habit;

public class CategoryDto
{
    public required long Id { get; init; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public string? IconName { get; set; }
    public string? Color { get; set; }
    public int SortOrder { get; set; }
}