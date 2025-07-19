using Momentum.Application.Abstractions;
using Momentum.Application.Dtos.Habit;
using Momentum.Domain.Errors;

namespace Momentum.Application.HabitEntries.Update;

public class UpdateHabitEntryCommand : ICommand<Unit>
{
    public required long EntryId { get; init; }
    public required HabitEntryDto HabitEntryDto { get; init; }
}

public class UpdateHabitEntryCommandHandler(IHabitEntryRepository repository, IMapper mapper)
    : ICommandHandler<UpdateHabitEntryCommand, Unit>
{
    public async Task<Result<Unit, IDomainError>> Handle(UpdateHabitEntryCommand request,
        CancellationToken cancellationToken)
    {
        Guard.Against.Null(request, nameof(UpdateHabitEntryCommand));
        
        var existingEntry = await repository.GetByIdAsync(request.EntryId, cancellationToken).ConfigureAwait(false);
        if (existingEntry == null)
        {
            return Result.Failure<Unit, IDomainError>(DomainError.NotFound("Habit entry not found"));
        }

        mapper.Map(request.HabitEntryDto, existingEntry);
        repository.Update(existingEntry);
        await repository.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        return Result.Success<Unit, IDomainError>(Unit.Value);
    }
}