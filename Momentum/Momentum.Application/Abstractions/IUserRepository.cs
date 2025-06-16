using Momentum.Domain.Entities.Auth;

namespace Momentum.Application.Abstractions;

public interface IUserRepository : IRepository<User>
{
    Task<bool> UserExistsAsync(string userId, CancellationToken cancellationToken);
}
