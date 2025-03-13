using Momentum.Application.Abstractions;
using Momentum.Application.Dtos.Users;
using Momentum.Domain.Errors;

namespace Momentum.Application.Users.Commands.CreateUser;

public record CreateUserCommand : IQuery<UserDto>
{
    public string UserName { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
}

public class CreateUserCommandHandler : IQueryHandler<CreateUserCommand, UserDto>
{
    public Task<Result<UserDto, IDomainError>> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        var user = new UserDto { UserName = "Hey", PasswordHash = "Name" };
        return Task.FromResult(Result.Success<UserDto, IDomainError>(user));
    }
}
