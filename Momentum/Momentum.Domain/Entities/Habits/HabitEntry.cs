namespace Momentum.Domain.Entities.Habits;

public class HabitEntry
{
    public required long Id { get; init; }

    public required DateTime Date { get; init; } // The day the habit was tracked
    public bool Completed { get; init; }

    public string? Note { get; init; }

    public required long HabitId { get; init; }
    public required Habit Habit { get; init; } = null!;
    public ICollection<Reminder> Reminders { get; init; } = [];

}
