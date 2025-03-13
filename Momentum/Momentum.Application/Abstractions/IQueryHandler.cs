using MediatR;
using Momentum.Domain.Errors;

namespace Momentum.Application.Abstractions;

public interface IQueryHandler<in TRequest, TResponse> : IRequestHandler<TRequest, Result<TResponse, IDomainError>>
    where TRequest : IQuery<TResponse>
    where TResponse : notnull
{
}
