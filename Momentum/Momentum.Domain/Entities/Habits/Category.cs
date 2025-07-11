namespace Momentum.Domain.Entities.Habits;

public class Category
{
    public long Id { get; init; }
    public required string Name { get; init; }
    public string? Description { get; set; }
    public string? IconName { get; set; } // Icon for UI display
    public string? Color { get; set; } // Hex color code
    public int SortOrder { get; set; }
    public bool IsSystem { get; set; } // System categories vs user-created
    public bool IsActive { get; set; } = true;

    public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Habit> Habits { get; init; } = [];
}
