namespace Momentum.Application.Dtos.Habit;

public class HabitEntryDto
{
    public long? Id { get; init; }
    public required DateTime Date { get; init; } // The day the habit was tracked

    public bool Completed { get; init; }

    public string? Note { get; init; }

    public required long HabitId { get; init; }
    public HabitDto? Habit { get; init; } = null!;
    public ICollection<ReminderDto> Reminders { get; } = [];
}
