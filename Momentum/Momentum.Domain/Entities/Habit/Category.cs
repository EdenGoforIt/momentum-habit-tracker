namespace Momentum.Domain.Entities.Habit;

public class Category
{
    public long Id { get; set; }
    public required string Name { get; set; }
    public ICollection<Habit> Habits { get; } = [];
}
