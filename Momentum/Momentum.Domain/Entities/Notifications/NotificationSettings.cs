using Momentum.Domain.Entities.Auth;
using Momentum.Domain.Entities.Habits;
using Momentum.Domain.Enums;

namespace Momentum.Domain.Entities.Notifications;

public class NotificationSettings
{
	public required long Id { get; init; }

	// Global notification settings
	public bool GlobalNotificationsEnabled { get; set; } = true;
	public bool PushNotificationsEnabled { get; set; } = true;
	public bool EmailNotificationsEnabled { get; set; }
	public bool InAppNotificationsEnabled { get; set; } = true;

	// Notification types
	public bool HabitRemindersEnabled { get; set; } = true;
	public bool AchievementNotificationsEnabled { get; set; } = true;
	public bool StreakNotificationsEnabled { get; set; } = true;
	public bool MotivationalNotificationsEnabled { get; set; } = true;
	public bool WeeklySummaryEnabled { get; set; } = true;

	// Timing preferences
	public TimeSpan? QuietHoursStart { get; set; }
	public TimeSpan? QuietHoursEnd { get; set; }
	public bool WeekendNotificationsEnabled { get; set; } = true;

	// Frequency settings
	public int MaxDailyNotifications { get; set; } = 10;
	public int ReminderSnoozeMinutes { get; set; } = 15;

	// User reference
	public required string UserId { get; init; }
	public required User User { get; init; } = null!;

	public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
	public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class NotificationLog
{
	public required long Id { get; init; }

	public required string Title { get; set; }
	public required string Message { get; set; }
	public required NotificationType Type { get; set; }

	public DateTime ScheduledFor { get; set; }
	public DateTime? SentAt { get; set; }
	public bool IsRead { get; set; }
	public bool IsSent { get; set; }

	// References
	public required string UserId { get; init; }
	public required User User { get; init; } = null!;

	public long? HabitId { get; set; }
	public Habit? Habit { get; set; }

	public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
