using MediatR;
using Momentum.Domain.Errors;

namespace Momentum.Application.Abstractions;
#pragma warning disable CA1040
public interface IRequestBase
{
}

public interface IQuery<TResponse> : IRequestBase, IRequest<Result<TResponse, IDomainError>> where TResponse : notnull
{
}
#pragma warning disable CA1040
public class IQuery : IRequestBase, IRequest<Result>
{
}
