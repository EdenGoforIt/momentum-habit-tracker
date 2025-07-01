using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Identity;
using Momentum.Application.Abstractions;
using Momentum.Application.Dtos.Users;
using Momentum.Domain.Entities.Auth;
using Momentum.Domain.Errors;

namespace Momentum.Application.Users.Queries.GetUsers;

[SuppressMessage("ReSharper", "ClassNeverInstantiated.Global")]
public record GetUsersQuery : IQuery<UserDto>
{
    public required string Email { get; set; }
}

// ReSharper disable once HollowTypeName
public class GetUsersueryHandler(UserManager<User> userManager, IMapper mapper) : IQueryHandler<GetUsersQuery, UserDto>
{
    private readonly IMapper _mapper = Guard.Against.Null(mapper, nameof(IMapper));
    private readonly UserManager<User> _userManager = Guard.Against.Null(userManager, nameof(UserManager<User>));

    public async Task<Result<UserDto, IDomainError>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
    {
        Guard.Against.Null(request, nameof(GetUsersQuery));

        User? user = await _userManager.FindByEmailAsync(request.Email).ConfigureAwait(false);

        if (user is null)
        {
            throw new NotFoundException(request.Email, nameof(User));
        }

        var userDto = _mapper.Map<UserDto>(user);

        return userDto;
    }
}
