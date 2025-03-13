using MediatR;
using Momentum.Domain.Errors;

namespace Momentum.Application.Abstractions;

public interface ICommandHandler<in TRequest, TResponse> : IRequestHandler<TRequest, Result<TResponse, IDomainError>>
    where TRequest : ICommand<TResponse>
    where TResponse : notnull
{
}

public interface ICommandHandler<in TRequest> : IRequestHandler<TRequest, Result<Unit>>
    where TRequest : ICommand
{
}
