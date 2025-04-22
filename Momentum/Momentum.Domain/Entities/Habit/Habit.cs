namespace Momentum.Domain.Entities.Habit;

public class Habit
{
    public required long Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public Guid UserId { get; set; } // Foreign key to User
    public int Frequency { get; set; } // e.g., daily, weekly
    public ICollection<HabitLog> Logs { get; } = [];
    public Guid? CategoryId { get; set; } // Optional category
    public required Category Category { get; set; }
}
