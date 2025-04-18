using Microsoft.AspNetCore.Identity;
using Momentum.Application.Abstractions;
using Momentum.Application.Dtos.Users;
using Momentum.Domain.Errors;

// ReSharper disable All

namespace Momentum.Application.Users.Commands.CreateUser;

public record CreateUserCommand : ICommand<long>
{
    public string UserName { get; set; } = string.Empty;
    public string? Password { get; set; } = string.Empty;
}

public class CreateUserCommandHandler : ICommandHandler<CreateUserCommand, long>
{
    private readonly UserManager<UserDto> _userManager;
    public CreateUserCommandHandler(UserManager<UserDto> userManager)
    {
        _userManager = userManager;
    } 
    public Task<Result<long, IDomainError>> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        var user = new UserDto()
        {
        };

        if (request?.Password != null)
        {
            string hashedPassword = new PasswordHasher<UserDto>().HashPassword(user, request.Password);
            user.UserName = request?.UserName;
            user.PasswordHash = hashedPassword;
        }

        return Task.FromResult(Result.Success<long, IDomainError>(1));
    }
}
