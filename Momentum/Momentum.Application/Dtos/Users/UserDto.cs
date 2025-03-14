namespace Momentum.Application.Dtos.Users;

public class UserDto
{
    public required string UserName { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public required string Password { get; set; } = string.Empty;

    public UserDto()
    {
    }
}
