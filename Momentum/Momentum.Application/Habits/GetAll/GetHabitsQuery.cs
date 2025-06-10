using Momentum.Application.Abstractions;
using Momentum.Application.Dtos.Habit;

namespace Momentum.Application.Habits.GetAll;

public abstract class GetHabitsQuery : IQuery<string>
{
    public required string Id { get; set; }
}
