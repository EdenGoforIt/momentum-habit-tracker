using MediatR;
using Momentum.Domain.Errors;

namespace Momentum.Api.Abstractions;

public interface IQueryHandler<TRequest, TResponse> : IRequestHandler<TRequest, Result<TResponse, IDomainError>>
    where TRequest : IQuery<TResponse>
    where TResponse : notnull
{
}
