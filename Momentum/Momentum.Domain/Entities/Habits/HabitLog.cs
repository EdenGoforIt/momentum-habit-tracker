namespace Momentum.Domain.Entities.Habits;

public class HabitLog
{
    public long Id { get; set; }
    public Guid HabitId { get; set; } // Foreign key to Habit
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public bool IsCompleted { get; set; }
    public required Habit Habit { get; set; }
}