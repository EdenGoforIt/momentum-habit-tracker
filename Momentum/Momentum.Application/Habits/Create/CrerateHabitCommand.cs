using Momentum.Application.Abstractions;
using Momentum.Application.Dtos.Habit;
using Momentum.Domain.Entities.Habits;
using Momentum.Domain.Errors;
using Momentum.Infrastructure.Data;

namespace Momentum.Application.Habits.Create;

public class CreateHabitCommand : ICommand<long>
{
    public required HabitDto HabitDto { get; init; }
}

// ReSharper disable once HollowTypeName
public class CreateHabitCommandHandler(DataContext context, IMapper mapper)
    : ICommandHandler<CreateHabitCommand, long>
{
    public async Task<Result<long, IDomainError>> Handle(CreateHabitCommand request,
        CancellationToken cancellationToken)
    {
        Guard.Against.Null(request, nameof(CreateHabitCommand));
        var habitEntity = mapper.Map<Habit>(request.HabitDto);

        await context.Habits.AddAsync(habitEntity, cancellationToken).ConfigureAwait(false);

        return Result.Success<long, IDomainError>(habitEntity.Id);
    }
}
