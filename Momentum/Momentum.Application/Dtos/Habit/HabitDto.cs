using FluentValidation;
using Momentum.Domain.Entities.Auth;
using Momentum.Domain.Entities.Habits;
using Momentum.Domain.Enums;

namespace Momentum.Application.Dtos.Habit;

public class HabitDto
{
    public long? Id { get; init; }
    public required string Name { get; init; } = string.Empty;
    public string? Description { get; init; }

    public required HabitFrequency Frequency { get; init; } // Daily, Weekly, etc.

    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
    public DateTime? ArchivedAt { get; init; }

    // User
    public required string UserId { get; init; }
    public User? User { get; init; }

    // Category
    public long? CategoryId { get; init; }
    public Category? Category { get; init; }

    public ICollection<HabitEntryDto> HabitEntries { get; } = [];
}

public class HabitDtoValidator : AbstractValidator<HabitDto>
{
    public HabitDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Habit name is required.")
            .MaximumLength(100).WithMessage("Habit name must not exceed 100 characters.");
        RuleFor(x => x.Description)
            .MaximumLength(500).WithMessage("Description must not exceed 500 characters.");
        RuleFor(x => x.Frequency).IsInEnum()
            .WithMessage("Frequency must be a valid HabitFrequency enum value.");
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("User ID is required.")
            .MaximumLength(50).WithMessage("User ID must not exceed 50 characters.");
        RuleFor(x => x.CategoryId)
            .GreaterThan(0).When(x => x.CategoryId.HasValue)
            .WithMessage("Category ID must be greater than 0 if provided.");
    }
}
