namespace Momentum.Domain.Entities.Habits;

public class Category
{
    public long Id { get; init; }
    public required string Name { get; init; }
    public ICollection<HabitEntry> Habits { get; init; } = [];
}
