using Ardalis.GuardClauses;
using Microsoft.AspNetCore.Identity;
using Momentum.Application.Abstractions;
using Momentum.Application.Dtos.Users;
using Momentum.Domain.Entities.Auth;
using Momentum.Domain.Errors;

// ReSharper disable All

namespace Momentum.Application.Users.Commands.CreateUser;

public record CreateUserCommand : ICommand<string>
{
    public required string Email { get; set; } = string.Empty;
    public string UserName => this.Email;
    public required string Password { get; set; } = string.Empty;
    public required string FirstName { get; set; } = string.Empty;
    public required string LastName { get; set; } = string.Empty;
    public DateTime? DateOfBirth { get; set; }
}

public class CreateUserCommandHandler : ICommandHandler<CreateUserCommand, string>
{
    private readonly IMapper _mapper;
    private readonly UserManager<User> _userManager;
#pragma warning restore CA1859

    public CreateUserCommandHandler(IMapper mapper, UserManager<User> userManager)
    {
        _userManager = Guard.Against.Null(userManager, nameof(userManager));
        _mapper = Guard.Against.Null(mapper, nameof(mapper));
    }

    public async Task<Result<string, IDomainError>> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        Guard.Against.Null(request, nameof(CreateUserCommand));
        // This will generate a new user and will be used to authenticate using userName and password using "/login"
        var userDto = new UserDto()
        {
            Email = request.Email,
            UserName = request.UserName,
            Password = request.Password,
            FirstName = request.FirstName,
            LastName = request.LastName,
            DateOfBirth = request.DateOfBirth
        };

        var user = _mapper.Map<User>(userDto);

        var result = await _userManager.CreateAsync(user, request.Password).ConfigureAwait(false);

        return user.Id;
    }
}
