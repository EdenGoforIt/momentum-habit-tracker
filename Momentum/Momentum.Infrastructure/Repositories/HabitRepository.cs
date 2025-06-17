using Momentum.Application.Abstractions;
using Momentum.Domain.Entities.Habits;

namespace Momentum.Infrastructure.Repositories;

public class HabitRepository : IHabitRepository
{

    public Task<IEnumerable<Habit>> GetAllAsync(CancellationToken cancellationToken = default) =>
        throw new NotImplementedException();

    public Task<Habit?> GetByIdAsync(object id, CancellationToken cancellationToken = default) =>
        throw new NotImplementedException();

    public void Add(Habit entity)
    {
        throw new NotImplementedException();
    }

    public void Update(Habit entity)
    {
        throw new NotImplementedException();
    }

    public void Delete(Habit entity)
    {
        throw new NotImplementedException();
    }
}
