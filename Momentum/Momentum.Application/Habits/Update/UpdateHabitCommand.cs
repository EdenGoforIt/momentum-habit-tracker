using Momentum.Application.Abstractions;
using Momentum.Application.Dtos.Habit;
using Momentum.Domain.Entities.Habits;
using Momentum.Domain.Errors;

namespace Momentum.Application.Habits.Update;

public class UpdateHabitCommand : ICommand<long>
{
    public required long HabitId { get; init; }
    public required HabitDto HabitDto { get; init; }
}

// ReSharper disable once HollowTypeName
public class UpdateHabitCommandHandler(IHabitRepository repository, IMapper mapper)
    : ICommandHandler<UpdateHabitCommand, long>
{
    public async Task<Result<long, IDomainError>> Handle(UpdateHabitCommand request,
        CancellationToken cancellationToken)
    {
        Guard.Against.Null(request, nameof(UpdateHabitCommand));
        var habitEntity = mapper.Map<Habit>(request.HabitDto);

        if (await repository.DoesHabitBelongToUserAsync(request.HabitId, request.HabitDto.UserId, cancellationToken)
                .ConfigureAwait(true))
        {
            return Result.Failure<long, IDomainError>(DomainError.Conflict(
                $"The habit with Id {request.HabitId} already exists for the user with Id {request.HabitDto.UserId}."));
        }

        repository.Update(habitEntity);
        await repository.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        return Result.Success<long, IDomainError>(habitEntity.Id);
    }
}
