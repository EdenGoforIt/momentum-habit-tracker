using Microsoft.EntityFrameworkCore;
using Momentum.Application.Abstractions;
using Momentum.Domain.Entities.Habits;
using Momentum.Infrastructure.Data;

namespace Momentum.Infrastructure.Repositories;

public class HabitEntryRepository : BaseRepository<HabitEntry>, IHabitEntryRepository
{
    private readonly DataContext _context;

    public HabitEntryRepository(DataContext context) : base(context)
    {
        _context = context;
    }

    public async Task<IEnumerable<HabitEntry>> GetByHabitIdAsync(long habitId, DateTime? startDate = null, DateTime? endDate = null, CancellationToken cancellationToken = default)
    {
        var query = _context.Set<HabitEntry>()
            .Where(he => he.HabitId == habitId);

        if (startDate.HasValue)
            query = query.Where(he => he.Date >= startDate.Value);

        if (endDate.HasValue)
            query = query.Where(he => he.Date <= endDate.Value);

        return await query
            .OrderByDescending(he => he.Date)
            .ToListAsync(cancellationToken)
            .ConfigureAwait(false);
    }

    public async Task<HabitEntry?> GetByIdAsync(long id, CancellationToken cancellationToken = default)
    {
        return await _context.Set<HabitEntry>()
            .FirstOrDefaultAsync(he => he.Id == id, cancellationToken)
            .ConfigureAwait(false);
    }

    public async Task<HabitEntry?> GetByHabitAndDateAsync(long habitId, DateTime targetDate, CancellationToken cancellationToken = default)
    {
        return await _context.Set<HabitEntry>()
            .FirstOrDefaultAsync(he => he.HabitId == habitId && he.Date.Date == targetDate.Date, cancellationToken)
            .ConfigureAwait(false);
    }

    public async Task<IEnumerable<HabitEntry>> GetUserEntriesAsync(string userId, DateTime? startDate = null, DateTime? endDate = null, CancellationToken cancellationToken = default)
    {
        var query = from entry in _context.Set<HabitEntry>()
                    join habit in _context.Set<Habit>() on entry.HabitId equals habit.Id
                    where habit.UserId == userId
                    select entry;

        if (startDate.HasValue)
            query = query.Where(he => he.Date >= startDate.Value);

        if (endDate.HasValue)
            query = query.Where(he => he.Date <= endDate.Value);

        return await query
            .OrderByDescending(he => he.Date)
            .ToListAsync(cancellationToken)
            .ConfigureAwait(false);
    }
}