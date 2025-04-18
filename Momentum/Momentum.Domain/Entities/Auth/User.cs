using Microsoft.AspNetCore.Identity;

namespace Momentum.Domain.Entities.Auth;

public class User : IdentityUser
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public DateTime? DateOfBirth { get; set; }
}
