namespace Momentum.Domain.Entities.Habits;

public class Reminder
{
    public long Id { get; init; }

    public long HabitEntryId { get; init; } // Foreign key to HabitEntry
    // Note: HabitEntry navigation removed to prevent performance issues

    public TimeSpan ReminderTime { get; init; } // Time of day (e.g., 08:00 AM)

    public DayOfWeek? DayOfWeek { get; init; } // For weekly reminders (optional)

    public string Message { get; init; } = "Don't forget your habit!";
}
