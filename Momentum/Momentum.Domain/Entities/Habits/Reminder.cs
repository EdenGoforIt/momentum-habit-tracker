namespace Momentum.Domain.Entities.Habits;

public class Reminder
{
    public long Id { get; set; }

    public long HabitId { get; set; } // Foreign key to Habit
    public Habit Habit { get; set; } = null!;

    public TimeSpan ReminderTime { get; set; } // Time of day (e.g., 08:00 AM)

    public DayOfWeek? DayOfWeek { get; set; } // For weekly reminders (optional)

    public string Message { get; set; } = "Don't forget your habit!";
}