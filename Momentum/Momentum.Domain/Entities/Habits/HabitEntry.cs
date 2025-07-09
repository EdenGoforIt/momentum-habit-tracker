namespace Momentum.Domain.Entities.Habits;

public class HabitEntry
{
    public required long Id { get; init; }

    public required DateTime Date { get; init; } // The day the habit was tracked
    public bool Completed { get; set; }
    public DateTime? CompletedAt { get; set; } // When it was marked complete

    // Enhanced tracking
    public int? DifficultyRating { get; set; } // 1-5 how difficult it was
    public int? MoodBefore { get; set; } // 1-10 mood before habit
    public int? MoodAfter { get; set; } // 1-10 mood after habit
    public TimeSpan? Duration { get; set; } // How long the habit took
    public string? Location { get; set; } // Where the habit was performed

    public string? Note { get; set; }

    // Metadata
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public required long HabitId { get; init; }
    // Note: Habit navigation removed to prevent performance issues
    // Note: Reminders should be accessed through repository using HabitEntryId
}
