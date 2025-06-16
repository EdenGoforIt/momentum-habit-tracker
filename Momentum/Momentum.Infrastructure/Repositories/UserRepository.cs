using Momentum.Application.Abstractions;
using Momentum.Domain.Entities.Auth;

namespace Momentum.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    public Task<IEnumerable<User>> GetAllAsync(CancellationToken cancellationToken = default) =>
        throw new NotImplementedException();

    public Task<User?> GetByIdAsync(object id, CancellationToken cancellationToken = default) =>
        throw new NotImplementedException();

    public void Add(User entity)
    {
        throw new NotImplementedException();
    }

    public void Update(User entity)
    {
        throw new NotImplementedException();
    }

    public void Delete(User entity)
    {
        throw new NotImplementedException();
    }

    public Task<bool> UserExistsAsync(string userId, CancellationToken cancellationToken) =>
        throw new NotImplementedException();
}
