namespace Momentum.Domain.Entities.Habits;

public class Reminder
{
    public long Id { get; set; }
    public Guid HabitId { get; set; } // Foreign key to Habit
    public DateTime ReminderTime { get; set; }
    public required string Message { get; set; }
    public required Habit Habit { get; set; }
}