using FluentValidation;

namespace Momentum.Application.Validators;

public static class UserValidationExtensions
{

    // public static IRuleBuilderOptions<T, string> userExists<T>(this IRuleBuilder<T, string> ruleBuilder)
    // {
    //     return ruleBuilder
    //         .NotEmpty()
    //         .WithMessage("User ID cannot be empty.")
    //         .MustAsync(async (userId, cancellationToken) =>
    //         {
    //             return await UserExistsAsync(userId, cancellationToken);
    //         })
    //         .WithMessage("User does not exist.");
    // }
    //
    // private static UserExistsAsync(string userId, CancellationToken cancellationToken)
    // {
    //     // Simulate an asynchronous check for user existence.
    //     // Replace this with actual logic to check if the user exists in your data store.
    //     return Task.FromResult(!string.IsNullOrWhiteSpace(userId) && userId.Length > 5);
    // }
}
