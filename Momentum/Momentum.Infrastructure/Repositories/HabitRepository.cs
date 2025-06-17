using Momentum.Application.Abstractions;
using Momentum.Application.Dtos.Habit;
using Momentum.Domain.Entities.Habits;
using Momentum.Infrastructure.Data;

namespace Momentum.Infrastructure.Repositories;

public class HabitRepository(DataContext context) : IHabitRepository
{
    public void Add(Habit entity)
    {
        context.Habits.Add(entity);
    }

    public void Update(Habit entity)
    {
        context.Habits.Remove(entity);
    }

    public void Delete(Habit entity)
    {
        context.Habits.Remove(entity);
    }

    public IQueryable<Habit> GetById(long id)
    {
        return context.Habits.Where(x => x.Id == id);
    }

    public IQueryable<Habit> GetAllByUserId(string userId)
    {
        return context.Habits.Where(x => x.UserId == userId);
    }
}
