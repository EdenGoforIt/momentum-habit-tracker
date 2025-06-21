using Microsoft.EntityFrameworkCore;
using Momentum.Application.Abstractions;
using Momentum.Domain.Entities.Auth;
using Momentum.Infrastructure.Data;

namespace Momentum.Infrastructure.Repositories;

public class UserRepository(DataContext context) : BaseRepository<User>(context), IUserRepository
{
    private readonly DataContext _context = context;

    public async Task<bool> UserExistsAsync(string userId, CancellationToken cancellationToken)
    {
        return await _context.Users.AnyAsync(u => u.Id == userId, cancellationToken).ConfigureAwait(false);
    }
}
