using Momentum.Domain.Entities.Auth;

namespace Momentum.Domain.Entities.Users;

public class UserPreferences
{
	public required long Id { get; init; }

	// Notification settings
	public bool NotificationsEnabled { get; set; } = true;
	public bool PushNotificationsEnabled { get; set; } = true;
	public bool EmailNotificationsEnabled { get; set; }

	// App appearance
	public bool DarkModeEnabled { get; set; }
	public string Theme { get; set; } = "Default"; // Default, Dark, Light, etc.

	// Calendar preferences
	public bool WeekStartsOnMonday { get; set; } = true;
	public string DateFormat { get; set; } = "MM/dd/yyyy";
	public string TimeFormat { get; set; } = "12"; // 12 or 24 hour

	// Habit tracking preferences
	public bool ShowCompletionPercentage { get; set; } = true;
	public bool ShowStreaks { get; set; } = true;
	public int ReminderAdvanceMinutes { get; set; } = 15;

	// Privacy settings
	public bool DataSharingEnabled { get; set; }
	public bool AnalyticsEnabled { get; set; } = true;

	// User reference
	public required string UserId { get; init; }
	public required User User { get; init; } = null!;

	public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
	public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
