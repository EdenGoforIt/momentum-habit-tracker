namespace Momentum.Domain.Entities.Habits;

public class HabitGoal
{
    public required long Id { get; init; }

    // Goal details
    public required string Title { get; set; }
    public string? Description { get; set; }
    public required int TargetValue { get; set; } // e.g., 30 for "30 days"
    public required GoalType Type { get; set; }
    public required GoalTimeframe Timeframe { get; set; }

    // Progress tracking
    public int CurrentProgress { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime? CompletedDate { get; set; }

    // Dates
    public DateTime StartDate { get; set; } = DateTime.UtcNow;
    public DateTime? EndDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Habit reference
    public required long HabitId { get; init; }
    // Note: Habit navigation removed to prevent performance issues
}

public enum GoalType
{
    Streak, // Consecutive completions
    TotalCompletions, // Total number of completions
    ConsistencyRate, // Percentage of successful completions
    Duration, // Time-based goal
    Custom // User-defined goal
}

public enum GoalTimeframe
{
    Daily,
    Weekly,
    Monthly,
    Quarterly,
    Yearly,
    Custom // User-defined timeframe
}
