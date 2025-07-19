using Momentum.Application.Abstractions;
using Momentum.Application.Dtos.Habit;
using Momentum.Domain.Entities.Habits;
using Momentum.Domain.Errors;

namespace Momentum.Application.HabitEntries.Create;

public class CreateHabitEntryCommand : ICommand<long>
{
    public required HabitEntryDto HabitEntryDto { get; init; }
}

public class CreateHabitEntryCommandHandler(IHabitEntryRepository repository, IMapper mapper)
    : ICommandHandler<CreateHabitEntryCommand, long>
{
    public async Task<Result<long, IDomainError>> Handle(CreateHabitEntryCommand request,
        CancellationToken cancellationToken)
    {
        Guard.Against.Null(request, nameof(CreateHabitEntryCommand));
        var entryEntity = mapper.Map<HabitEntry>(request.HabitEntryDto);
        repository.Add(entryEntity);
        await repository.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        return Result.Success<long, IDomainError>(entryEntity.Id);
    }
}