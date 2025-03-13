namespace Momentum.Application.Dtos.Users;

public class UserDto
{
    public required string UserName { get; set; } = string.Empty;
    public required string PasswordHash { get; set; } = string.Empty;
}
