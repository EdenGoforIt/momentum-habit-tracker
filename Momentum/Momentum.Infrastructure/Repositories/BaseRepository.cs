using Momentum.Infrastructure.Data;

namespace Momentum.Infrastructure.Repositories;

public class BaseRepository<T> where T : class
{
    private readonly DataContext _context;

    public BaseRepository(DataContext context)
    {
        _context = context;
    }

    public virtual void Add(T entity)
    {
        _context.Set<T>().Add(entity);
    }

    public virtual void Update(T entity)
    {
        _context.Set<T>().Update(entity);
    }

    public virtual void Delete(T entity)
    {
        _context.Set<T>().Remove(entity);
    }

    public virtual Task SaveChangesAsync(CancellationToken cancellationToken = default) =>
        _context.SaveChangesAsync(cancellationToken);
}
