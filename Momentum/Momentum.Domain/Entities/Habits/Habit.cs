using Momentum.Domain.Entities.Auth;
using Momentum.Domain.Enums;

namespace Momentum.Domain.Entities.Habits;

public class Habit
{
    public required long Id { get; init; }

    public required string Name { get; init; } = string.Empty;
    public string? Description { get; init; }

    public required HabitFrequency Frequency { get; init; } // Daily, Weekly, etc.

    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
    public DateTime? ArchivedAt { get; init; }

    // User
    public required string UserId { get; init; }
    public required User User { get; init; } = null!;

    // Category
    public long? CategoryId { get; init; }
    public Category? Category { get; init; }

    public ICollection<HabitEntry> HabitEntries { get; } = [];
}
