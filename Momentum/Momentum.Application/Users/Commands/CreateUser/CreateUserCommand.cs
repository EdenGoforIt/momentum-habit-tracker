using MediatR;
using Microsoft.AspNetCore.Identity;
using Momentum.Application.Abstractions;
using Momentum.Application.Dtos.Users;
using Momentum.Domain.Errors;

// ReSharper disable All

namespace Momentum.Application.Users.Commands.CreateUser;

public record CreateUserCommand : ICommand<long>
{
    public string UserName { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class CreateUserCommandHandler : ICommandHandler<CreateUserCommand, long>
{
    public Task<Result<long, IDomainError>> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        var user = new UserDto(){};

        string hashedPassword = new PasswordHasher<UserDto>().HashPassword(user, request.Password);
        user.UserName = request.UserName;
        user.PasswordHash = hashedPassword;

        return Task.FromResult(Result.Success<long, IDomainError>(1));
    }
}
