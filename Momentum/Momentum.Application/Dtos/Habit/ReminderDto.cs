namespace Momentum.Application.Dtos.Habit;

public class ReminderDto
{
    public long Id { get; init; }

    public long HabitEntryId { get; init; } // Foreign key to Habit
    public HabitEntryDto? HabitEntry { get; init; }

    public TimeSpan ReminderTime { get; init; } // Time of day (e.g., 08:00 AM)

    public DayOfWeek? DayOfWeek { get; init; } // For weekly reminders (optional)

    public string Message { get; init; } = "Don't forget your habit!";
}
