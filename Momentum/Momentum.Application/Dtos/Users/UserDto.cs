namespace Momentum.Application.Dtos.Users;

public class UserDto
{
    public Guid? Id { get; set; }
    public required string Email { get; set; }
    public string? UserName { get; set; }
    public required string Password { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public DateTime? DateOfBirth { get; set; }
}
