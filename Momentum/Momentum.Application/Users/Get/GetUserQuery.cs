using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Identity;
using Momentum.Application.Abstractions;
using Momentum.Application.Dtos.Users;
using Momentum.Domain.Entities.Auth;
using Momentum.Domain.Errors;

namespace Momentum.Application.Users.Queries.GetUser;

[SuppressMessage("ReSharper", "ClassNeverInstantiated.Global")]
public record GetUserQuery : IQuery<UserDto>
{
    public required string Id { get; set; }
}

// ReSharper disable once HollowTypeName
public class GetUserQueryHandler(UserManager<User> userManager, IMapper mapper) : IQueryHandler<GetUserQuery, UserDto>
{
    private readonly IMapper _mapper = Guard.Against.Null(mapper, nameof(IMapper));
    private readonly UserManager<User> _userManager = Guard.Against.Null(userManager, nameof(UserManager<User>));

    public async Task<Result<UserDto, IDomainError>> Handle(GetUserQuery request, CancellationToken cancellationToken)
    {
        Guard.Against.Null(request, nameof(GetUserQuery));

        User? user = await _userManager.FindByIdAsync(request.Id).ConfigureAwait(false);

        if (user is null)
        {
            throw new NotFoundException(request.Id, nameof(User));
        }

        var userDto = _mapper.Map<UserDto>(user);

        return userDto;
    }
}
