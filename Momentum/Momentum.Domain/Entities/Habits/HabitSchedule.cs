using Momentum.Domain.Entities.Habits;

namespace Momentum.Domain.Entities.Habits;

public class HabitSchedule
{
	public required long Id { get; init; }

	// Schedule configuration
	public DateTime StartDate { get; set; } = DateTime.UtcNow;
	public DateTime? EndDate { get; set; }
	public bool IsActive { get; set; } = true;

	// Custom scheduling
	public string? CustomDays { get; set; } // JSON array of selected days of week [1,3,5] for Mon, Wed, Fri
	public TimeSpan? PreferredTime { get; set; } // Preferred time of day
	public int? MaxDailyCompletions { get; set; } = 1; // How many times per day

	// Advanced scheduling
	public bool SkipWeekends { get; set; }
	public bool SkipHolidays { get; set; }
	public string? TimeZone { get; set; }

	// Habit reference
	public required long HabitId { get; init; }
	// Note: Habit navigation removed to prevent performance issues

	public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
	public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
