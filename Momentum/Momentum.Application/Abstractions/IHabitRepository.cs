using Momentum.Domain.Entities.Habits;

namespace Momentum.Application.Abstractions;

public interface IHabitRepository : IRepository<Habit>
{
    IQueryable<Habit> GetById(long id);
    IQueryable<Habit> GetAllByUserId(string userId);
    Task<bool> DoesHabitBelongToUserAsync(long habitId, string userId, CancellationToken cancellationToken = default);
}
