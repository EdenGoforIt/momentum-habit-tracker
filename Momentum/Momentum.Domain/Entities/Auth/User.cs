using Microsoft.AspNetCore.Identity;

namespace Momentum.Domain.Entities.Auth;

public class User : IdentityUser
{
    public string FirstName { get; init; } = string.Empty;
    public string LastName { get; init; } = string.Empty;
    public DateTime? DateOfBirth { get; init; }
}
