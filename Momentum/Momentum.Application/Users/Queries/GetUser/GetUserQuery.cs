using Momentum.Api.Abstractions;
using Momentum.Application.Dtos.Users;
using Momentum.Domain.Errors;

namespace Momentum.Application.Users.Queries.GetUser;

public record GetUserQuery : IQuery<UserDto>
{
    public long Id { get; set; }
}

// ReSharper disable once HollowTypeName
public class GetUserQueryHandler : IQueryHandler<GetUserQuery, UserDto>
{
    public Task<Result<UserDto, IDomainError>> Handle(GetUserQuery request, CancellationToken cancellationToken)
    {
        var user = new UserDto { Id = 1, Name = "Name" };
        return Task.FromResult(Result.Success<UserDto, IDomainError>(user));
    }
}
