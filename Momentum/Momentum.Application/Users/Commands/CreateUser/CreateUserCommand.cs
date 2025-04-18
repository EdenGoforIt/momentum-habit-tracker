using Microsoft.AspNetCore.Identity;
using Momentum.Application.Abstractions;
using Momentum.Application.Dtos.Users;
using Momentum.Domain.Entities.Auth;
using Momentum.Domain.Errors;

// ReSharper disable All

namespace Momentum.Application.Users.Commands.CreateUser;

public record CreateUserCommand : ICommand<long>
{
    public required string Email { get; set; } = string.Empty;
    public required string Password { get; set; } = string.Empty;
    public required string FirstName { get; set; } = string.Empty;
    public required string LastName { get; set; } = string.Empty;
    public DateTime? DateOfBirth { get; set; }
}

public class CreateUserCommandHandler : ICommandHandler<CreateUserCommand, long>
{
    private readonly UserManager<User> _userManager;
    public CreateUserCommandHandler(UserManager<User> userManager)
    {
        _userManager = userManager;
    } 
    public Task<Result<long, IDomainError>> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(request);
        
        var user = new UserDto()
        {
            Email = request.Email,
            Password = request.Password,
            FirstName = request.FirstName,
            LastName = request.LastName,
            DateOfBirth = request.DateOfBirth
        }; 

        return Task.FromResult(Result.Success<long, IDomainError>(1));
    }
}
