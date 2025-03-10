using MediatR;
using Momentum.Application.Dtos.Users;

namespace Momentum.Application.Users.GetUser;

public record GetUserQuery:IRequest<UserDto>
{
    public long Id { get; set; }
}

public class GetUserQueryHandler: IRequestHandler<>
