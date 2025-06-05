using Microsoft.AspNetCore.Identity;

namespace Momentum.Domain.Entities.Auth;

public class User : IdentityUser
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public DateTime? DateOfBirth { get; init; }
}
