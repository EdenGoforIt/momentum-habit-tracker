using System.Diagnostics.CodeAnalysis;

namespace Momentum.Domain.Errors;

[SuppressMessage("Style", "IDE0022:Use block body for method")]
public record DomainError : IDomainError
{

    // Constructor is private to enforce the usage of static methods
    private DomainError(string? message, ErrorType errorType, List<string>? errors = null)
    {
        ErrorMessage = message;
        ErrorType = errorType;

        if (errors != null)
        {
            Errors = new List<string>(errors);
        }
    }

    // Properties for error message and type
    public string? ErrorMessage { get; init; }
    public ErrorType ErrorType { get; init; }

    public List<string>? Errors { get; init; } = new();

    // Static factory methods for common error types
    public static DomainError Conflict(string? message = "The data provided conflicts with existing data.") =>
        new(message ?? "The data provided conflicts with existing data.", ErrorType.Conflict);

    public static DomainError NotFound(string? message = "The requested item could not be found.") =>
        new(message ?? "The requested item could not be found.", ErrorType.NotFound);

    public static DomainError BadRequest(string? message = "Invalid request or parameters.") =>
        new(message ?? "Invalid request or parameters.", ErrorType.BadRequest);

#pragma warning disable CA1002
    public static DomainError Validation(string? message = "Validation Failed.", List<string>? errors = null) =>
#pragma warning restore CA1002
        new(message ?? "Validation Failed.", ErrorType.Validation, errors);

    public static DomainError UnExpected(string? message = "Unexpected error happened.") =>
        new(message ?? "Something when wrong.", ErrorType.Unexpected);
}
