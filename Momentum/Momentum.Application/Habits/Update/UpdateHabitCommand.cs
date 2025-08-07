using Microsoft.EntityFrameworkCore;
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

        if (!await repository.DoesHabitBelongToUserAsync(request.HabitId, request.HabitDto.UserId, cancellationToken)
                .ConfigureAwait(true))
        {
            return Result.Failure<long, IDomainError>(DomainError.Conflict(
                $"The habit with Id {request.HabitId} does not belong to the user with Id {request.HabitDto.UserId}."));
        }

        var existingHabit = await repository.GetById(request.HabitId)
            .FirstOrDefaultAsync(cancellationToken)
            .ConfigureAwait(false);
        
        if (existingHabit == null)
        {
            return Result.Failure<long, IDomainError>(DomainError.NotFound(
                $"Habit with Id {request.HabitId} not found."));
        }

        // Map the DTO properties onto the existing entity
        // Note: The ID is preserved because we're mapping onto existing entity
        mapper.Map(request.HabitDto, existingHabit);
        
        // Ensure the ID is preserved (mapper ignores ID by design)
        existingHabit.Id = request.HabitId;
        
        repository.Update(existingHabit);
        await repository.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        return Result.Success<long, IDomainError>(existingHabit.Id);
    }
}
