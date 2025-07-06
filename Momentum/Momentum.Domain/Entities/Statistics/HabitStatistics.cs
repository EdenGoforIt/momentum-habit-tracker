using Momentum.Domain.Entities.Habits;

namespace Momentum.Domain.Entities.Statistics;

public class HabitStatistics
{
	public required long Id { get; init; }

	// Basic completion statistics
	public int TotalCompletions { get; set; }
	public int TotalEntries { get; set; }
	public double CompletionRate { get; set; }

	// Streak information
	public int CurrentStreak { get; set; }
	public int LongestStreak { get; set; }
	public DateTime? LastCompletionDate { get; set; }
	public DateTime? StreakStartDate { get; set; }

	// Time-based statistics
	public int CompletionsThisWeek { get; set; }
	public int CompletionsThisMonth { get; set; }
	public int CompletionsThisYear { get; set; }

	// Performance metrics
	public double WeeklyCompletionRate { get; set; }
	public double MonthlyCompletionRate { get; set; }
	public int MissedDays { get; set; }
	public int ConsecutiveMissedDays { get; set; }

	// Timing analysis
	public TimeSpan? AverageCompletionTime { get; set; }
	public TimeSpan? BestCompletionTime { get; set; }
	public string? MostActiveDay { get; set; } // Day of week when most completions happen
	public string? MostActiveTimeOfDay { get; set; } // Time period when most completions happen

	// Habit reference
	public required long HabitId { get; init; }
	// Note: Habit navigation removed to prevent performance issues

	// Tracking
	public DateTime LastCalculated { get; set; } = DateTime.UtcNow;
	public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
