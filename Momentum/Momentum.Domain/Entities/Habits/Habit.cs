using Momentum.Domain.Entities.Auth;
using Momentum.Domain.Enums;

namespace Momentum.Domain.Entities.Habits;

public class Habit
{
	public required long Id { get; init; }

	public required string Name { get; set; } = string.Empty;
	public string? Description { get; set; }

	public required HabitFrequency Frequency { get; init; } // Daily, Weekly, etc.

	// Enhanced properties for frontend features
	public string? IconName { get; set; } // Icon identifier for UI
	public string? Color { get; set; } // Hex color code for UI theming
	public int Priority { get; set; } = 1; // 1 = High, 2 = Medium, 3 = Low
	public int DifficultyLevel { get; set; } = 1; // 1-5 scale

	// Scheduling
	public DateTime? StartDate { get; set; }
	public DateTime? EndDate { get; set; }
	public TimeSpan? PreferredTime { get; set; }

	// Tracking settings
	public bool IsPublic { get; set; } // For sharing with friends/community
	public bool NotificationsEnabled { get; set; } = true;
	public int ReminderMinutesBefore { get; set; } = 15;

	// Metadata
	public int SortOrder { get; set; }
	public string? Notes { get; set; } // Private notes about the habit

	public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
	public DateTime? ArchivedAt { get; set; }

	// User
	public required string UserId { get; init; }
	// Note: User navigation removed to prevent performance issues

	// Category
	public long? CategoryId { get; set; }
	// Note: Category navigation can stay as it's a single entity lookup
	public Category? Category { get; set; }
}
