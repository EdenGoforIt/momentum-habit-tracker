using Momentum.Domain.Entities.Auth;
using Momentum.Domain.Enums;

namespace Momentum.Domain.Entities.Habits;

public class Habit
{
    public required long Id { get; set; }

    public required string Name { get; set; } = string.Empty;
    public string? Description { get; set; }

    public required HabitFrequency Frequency { get; set; } // Daily, Weekly, etc.

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ArchivedAt { get; set; }

    // User
    public long UserId { get; set; }
    public required User User { get; set; } = null!;

    // Category
    public long? CategoryId { get; set; }
    public Category? Category { get; set; }

    public ICollection<HabitEntry> Entries { get; } = [];
}
