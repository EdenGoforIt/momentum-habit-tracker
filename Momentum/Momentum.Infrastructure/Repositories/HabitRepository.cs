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
}
