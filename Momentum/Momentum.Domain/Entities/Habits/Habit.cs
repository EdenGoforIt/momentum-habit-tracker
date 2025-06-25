using Momentum.Domain.Entities.Auth;
using Momentum.Domain.Enums;

namespace Momentum.Domain.Entities.Habits;

public class Habit
{
    public required long Id { get; init; }

    public required string Name { get; set; } = string.Empty;
    public string? Description { get; set; }

    public required HabitFrequency Frequency { get; init; } // Daily, Weekly, etc.

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ArchivedAt { get; set; }

    // User
    public required string UserId { get; init; }
    public required User User { get; init; } = null!;

    // Category
    public long? CategoryId { get; set; }
    public Category? Category { get; set; }

    public ICollection<HabitEntry> HabitEntries { get; } = [];
}
