using Momentum.Domain.Entities.Auth;

namespace Momentum.Domain.Entities.Statistics;

public class UserStatistics
{
	public required long Id { get; init; }

	// Current streaks
	public int CurrentStreak { get; set; }
	public int LongestStreak { get; set; }
	public DateTime? LastStreakDate { get; set; }

	// Completion statistics
	public int TotalHabitsCompleted { get; set; }
	public int TotalHabitsCreated { get; set; }
	public double OverallCompletionRate { get; set; }

	// Time-based statistics
	public int CompletionsThisWeek { get; set; }
	public int CompletionsThisMonth { get; set; }
	public int CompletionsThisYear { get; set; }

	// Habit tracking metrics
	public int ActiveHabits { get; set; }
	public int ArchivedHabits { get; set; }
	public DateTime? FirstHabitCreated { get; set; }

	// Consistency metrics
	public int ConsecutiveDaysActive { get; set; }
	public double WeeklyConsistencyRate { get; set; }
	public double MonthlyConsistencyRate { get; set; }

	// Achievement counts
	public int BadgesEarned { get; set; }
	public int MilestonesReached { get; set; }

	// User reference
	public required string UserId { get; init; }
	// Note: User navigation removed to prevent performance issues

	// Tracking
	public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
	public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
