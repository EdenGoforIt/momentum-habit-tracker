using Momentum.Application.Abstractions;
using Momentum.Application.Dtos.Habit;
using Momentum.Domain.Entities.Habits;
using Momentum.Domain.Errors;

namespace Momentum.Application.Habits.Create;

public class CreateHabitCommand : ICommand<long>
{
    public required HabitDto HabitDto { get; init; }
}

// ReSharper disable once HollowTypeName
public class CreateHabitCommandHandler(IHabitRepository repository, IMapper mapper)
    : ICommandHandler<CreateHabitCommand, long>
{
    public async Task<Result<long, IDomainError>> Handle(CreateHabitCommand request,
        CancellationToken cancellationToken)
    {
        Guard.Against.Null(request, nameof(CreateHabitCommand));
        var habitEntity = mapper.Map<Habit>(request.HabitDto);
        repository.Add(habitEntity);
        await repository.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        return Result.Success<long, IDomainError>(habitEntity.Id);
    }
}
