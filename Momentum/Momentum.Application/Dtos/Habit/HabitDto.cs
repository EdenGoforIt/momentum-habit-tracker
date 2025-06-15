using Momentum.Domain.Entities.Auth;
using Momentum.Domain.Entities.Habits;
using Momentum.Domain.Enums;

namespace Momentum.Application.Dtos.Habit;

public class HabitDto
{
    public required long Id { get; init; }

    public required string Name { get; init; } = string.Empty;
    public string? Description { get; init; }

    public required HabitFrequency Frequency { get; init; } // Daily, Weekly, etc.

    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
    public DateTime? ArchivedAt { get; init; }

    // User
    public required string UserId { get; init; }
    public User? User { get; init; }

    // Category
    public long? CategoryId { get; init; }
    public Category? Category { get; init; }

    public ICollection<HabitEntryDto> HabitEntries { get; } = [];
}
