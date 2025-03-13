using MediatR;
using Momentum.Application.Abstractions;
using Momentum.Application.Dtos.Users;
using Momentum.Domain.Errors;

// ReSharper disable All

namespace Momentum.Application.Users.Commands.CreateUser;

public record CreateUserCommand : ICommand<long>
{
    public string UserName { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
}

public class CreateUserCommandHandler : ICommandHandler<CreateUserCommand, long>
{
    public Task<Result<long, IDomainError>> Handle(CreateUserCommand request, CancellationToken cancellationToken) =>
        Task.FromResult(Result.Success<long, IDomainError>(1));
}
