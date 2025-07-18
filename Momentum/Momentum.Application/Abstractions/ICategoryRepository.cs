using Momentum.Domain.Entities.Habits;

namespace Momentum.Application.Abstractions;

public interface ICategoryRepository : IRepository<Category>
{
    Task<IEnumerable<Category>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Category?> GetByIdAsync(long id, CancellationToken cancellationToken = default);
}