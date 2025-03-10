using System.Collections.ObjectModel;

namespace Momentum.Domain.Errors;

public interface IDomainError
{
    string? ErrorMessage { get; init; }
    ErrorType ErrorType { get; init; }
    public Collection<string>? Errors { get; init; }
}
