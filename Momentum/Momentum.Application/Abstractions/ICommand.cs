using MediatR;
using Momentum.Domain.Errors;

namespace Momentum.Application.Abstractions;

#pragma warning disable CA1040
public interface ICommand<TResponse> : IRequestBase, IRequest<Result<TResponse, IDomainError>>
#pragma warning restore CA1040
    where TResponse : notnull
{
}
#pragma warning disable CA1040
public interface ICommand : IRequestBase, IRequest<Result<Unit>>
{
}
