namespace Momentum.Application.Abstractions;

public interface IRepository<in T> where T : class
{
    void Add(T entity);
    void Update(T entity);
    void Delete(T entity);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
