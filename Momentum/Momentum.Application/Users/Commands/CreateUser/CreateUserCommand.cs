using Ardalis.GuardClauses;
using Microsoft.AspNetCore.Identity;
using Momentum.Application.Abstractions;
using Momentum.Application.Dtos.Users;
using Momentum.Domain.Entities.Auth;
using Momentum.Domain.Errors;

// ReSharper disable All

namespace Momentum.Application.Users.Commands.CreateUser;

public record CreateUserCommand : ICommand<long>
{
    public required string Email { get; set; } = string.Empty;
    public required string Password { get; set; } = string.Empty;
    public required string FirstName { get; set; } = string.Empty;
    public required string LastName { get; set; } = string.Empty;
    public DateTime? DateOfBirth { get; set; }
}

public class CreateUserCommandHandler : ICommandHandler<CreateUserCommand, long>
{
    private readonly UserManager<User> _userManager;
#pragma warning disable CA1859
    private readonly IMapper _mapper;
#pragma warning restore CA1859

    public CreateUserCommandHandler(UserManager<User> userManager, IMapper mapper)
    {
        _userManager = Guard.Against.Null(userManager, nameof(userManager));
        _mapper = Guard.Against.Null(mapper, nameof(mapper));
    }

    public async Task<Result<long, IDomainError>> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        Guard.Against.Null(request, nameof(CreateUserCommand));

        var userDto = new UserDto()
        {
            Email = request.Email,
            Password = request.Password,
            FirstName = request.FirstName,
            LastName = request.LastName,
            DateOfBirth = request.DateOfBirth
        };

        var user = _mapper.Map<User>(userDto);

        var result = await _userManager.CreateAsync(user, request.Password).ConfigureAwait(true);

        return Result.Success<long, IDomainError>(1);
    }
}
