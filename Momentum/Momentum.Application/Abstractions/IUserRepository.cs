namespace Momentum.Application.Abstractions;

public interface IUserRepository
{
    Task<bool> UserExistsAsync(string userId, CancellationToken cancellationToken);
}
