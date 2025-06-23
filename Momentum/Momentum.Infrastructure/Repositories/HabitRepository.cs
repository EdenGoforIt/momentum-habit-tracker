using Microsoft.EntityFrameworkCore;
using Momentum.Application.Abstractions;
using Momentum.Domain.Entities.Habits;
using Momentum.Infrastructure.Data;

namespace Momentum.Infrastructure.Repositories;

public class HabitRepository(DataContext context) : BaseRepository<Habit>(context), IHabitRepository
{
    private readonly DataContext _context = context;

    public IQueryable<Habit> GetById(long id)
    {
        return _context.Habits.Where(x => x.Id == id);
    }

    public IQueryable<Habit> GetAllByUserId(string userId)
    {
        return _context.Habits.Where(x => x.UserId == userId);
    }

    public async Task<bool> DoesHabitBelongToUserAsync(long habitId, string userId,
        CancellationToken cancellationToken = default)
    {
        return await _context.Habits.AnyAsync(x => x.Id == habitId && x.UserId == userId,
            cancellationToken).ConfigureAwait(true);
    }
}
