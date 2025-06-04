using System.ComponentModel.DataAnnotations;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Momentum.Application.Abstractions;
using Momentum.Application.Users.Commands.CreateUser;
using Momentum.Domain.Entities.Auth;
using Momentum.Domain.Errors;

namespace Momentum.Application.Users.Update;

public class PatchUserCommand : ICommand<Unit>
{
    public string Id { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}

// ReSharper disable once HollowTypeName
public class PatchUserCommandHandler(UserManager<User> userManager)
    : ICommandHandler<PatchUserCommand, Unit>
{
    private readonly UserManager<User> _userManager = Guard.Against.Null(userManager, nameof(userManager));
#pragma warning restore CA1859

    public async Task<Result<Unit, IDomainError>> Handle(PatchUserCommand request,
        CancellationToken cancellationToken)
    {
        Guard.Against.Null(request, nameof(CreateUserCommand));

        User? user = await _userManager.FindByIdAsync(request.Id).ConfigureAwait(false);

        if (user == null)
        {
            throw new NotFoundException(request.Id, "User");
        }

        user.Email = request.Email;

        IdentityResult result = await _userManager.UpdateAsync(user).ConfigureAwait(false);

        if (!result.Succeeded)
        {
            string errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new ValidationException("Failed to update user: " + errors);
        }

        return Unit.Value;
    }
}
