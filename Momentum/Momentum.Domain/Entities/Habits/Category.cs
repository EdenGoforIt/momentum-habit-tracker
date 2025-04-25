namespace Momentum.Domain.Entities.Habits;

public class Category
{
    public long Id { get; set; }
    public required string Name { get; set; }
    public ICollection<Habit> Habits { get; } = [];
}
