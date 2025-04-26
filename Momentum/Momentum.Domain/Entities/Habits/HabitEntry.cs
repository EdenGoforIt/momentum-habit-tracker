namespace Momentum.Domain.Entities.Habits;

public class HabitEntry
{
    public required long Id { get; set; }

    public required DateTime Date { get; set; } // The day the habit was tracked
    public bool Completed { get; set; }

    public string? Note { get; set; }

    public required long HabitId { get; set; }
    public required Habit Habit { get; set; } = null!;
}
