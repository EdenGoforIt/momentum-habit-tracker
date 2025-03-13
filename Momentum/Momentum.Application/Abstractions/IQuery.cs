using MediatR;
using Momentum.Domain.Errors;

namespace Momentum.Application.Abstractions;

public interface IRequestBase
{
}

public interface IQuery<TResponse> : IRequestBase, IRequest<Result<TResponse, IDomainError>> where TResponse : notnull
{
}

public class IQuery : IRequestBase, IRequest<Result>
{
}
