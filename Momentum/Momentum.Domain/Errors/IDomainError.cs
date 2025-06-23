namespace Momentum.Domain.Errors;

public interface IDomainError
{
    string? ErrorMessage { get; init; }
    ErrorType ErrorType { get; init; }
#pragma warning disable CA1002
    public List<string>? Errors { get; init; }
#pragma warning restore CA1002
}
