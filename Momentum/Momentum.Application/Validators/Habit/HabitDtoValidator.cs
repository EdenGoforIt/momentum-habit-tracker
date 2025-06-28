using FluentValidation;
using Momentum.Application.Dtos.Habit;

namespace Momentum.Application.Validators.Habit;


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
