using Momentum.Domain.Entities.Habits;

namespace Momentum.Application.Abstractions;

public interface IHabitEntryRepository : IRepository<HabitEntry>
{
    Task<IEnumerable<HabitEntry>> GetByHabitIdAsync(long habitId, DateTime? startDate = null, DateTime? endDate = null, CancellationToken cancellationToken = default);
    Task<HabitEntry?> GetByIdAsync(long id, CancellationToken cancellationToken = default);
    Task<HabitEntry?> GetByHabitAndDateAsync(long habitId, DateTime targetDate, CancellationToken cancellationToken = default);
    Task<IEnumerable<HabitEntry>> GetUserEntriesAsync(string userId, DateTime? startDate = null, DateTime? endDate = null, CancellationToken cancellationToken = default);
}