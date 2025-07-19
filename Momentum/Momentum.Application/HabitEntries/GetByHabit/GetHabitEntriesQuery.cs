using Momentum.Application.Abstractions;
using Momentum.Application.Dtos.Habit;
using Momentum.Domain.Errors;

namespace Momentum.Application.HabitEntries.GetByHabit;

public class GetHabitEntriesQuery : IQuery<IEnumerable<HabitEntryDto>>
{
    public required long HabitId { get; init; }
    public DateTime? StartDate { get; init; }
    public DateTime? EndDate { get; init; }
}

public class GetHabitEntriesQueryHandler(IHabitEntryRepository repository, IMapper mapper)
    : IQueryHandler<GetHabitEntriesQuery, IEnumerable<HabitEntryDto>>
{
    public async Task<Result<IEnumerable<HabitEntryDto>, IDomainError>> Handle(GetHabitEntriesQuery request,
        CancellationToken cancellationToken)
    {
        Guard.Against.Null(request, nameof(GetHabitEntriesQuery));
        
        var entries = await repository.GetByHabitIdAsync(request.HabitId, request.StartDate, request.EndDate, cancellationToken).ConfigureAwait(false);
        var dtos = mapper.Map<IEnumerable<HabitEntryDto>>(entries);
        
        return Result.Success<IEnumerable<HabitEntryDto>, IDomainError>(dtos);
    }
}