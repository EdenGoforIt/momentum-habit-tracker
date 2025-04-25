using System.Diagnostics.CodeAnalysis;
using Ardalis.GuardClauses;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Momentum.Application.Abstractions;
using Momentum.Application.Dtos.Users;
using Momentum.Domain.Entities.Auth;
using Momentum.Domain.Errors;

namespace Momentum.Application.Users.Queries.GetUser;

[SuppressMessage("ReSharper", "ClassNeverInstantiated.Global")]
public record GetUserQuery : IQuery<UserDto>
{
    public required string UserName { get; set; }
}

// ReSharper disable once HollowTypeName
public class GetUserQueryHandler : IQueryHandler<GetUserQuery, UserDto>
{
    private readonly UserManager<User> _userManager;
    private readonly IMapper _mapper;

    public GetUserQueryHandler(UserManager<User> userManager, IMapper mapper)
    {
        _mapper = Guard.Against.Null(mapper, nameof(IMapper));
        _userManager = Guard.Against.Null(userManager, nameof(UserManager<User>));
    }

    public async Task<Result<UserDto, IDomainError>> Handle(GetUserQuery request, CancellationToken cancellationToken)
    {
        Guard.Against.Null(request, nameof(GetUserQuery));

        User? user = await _userManager.FindByNameAsync(request.UserName).ConfigureAwait(false);

        if (user is null)
        {
            throw new NotFoundException(request.UserName, nameof(User));
        }

        UserDto userDto = _mapper.Map<UserDto>(user);

        return userDto;
    }
}
