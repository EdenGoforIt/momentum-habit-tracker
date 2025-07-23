using Momentum.Application.Abstractions;
using Momentum.Application.Dtos.Habit;
using Momentum.Domain.Errors;

namespace Momentum.Application.HabitEntries.GetByHabit;

public class GetHabitEntriesQuery : IQuery<IEnumerable<HabitEntryDto>>
{
    public required long HabitId { get; init; }
    public DateTime? StartDate { get; init; }
    public DateTime? EndDate { get; init; }
    public string? Month { get; init; } // Format: YYYY-MM
}

public class GetHabitEntriesQueryHandler(IHabitEntryRepository repository, IMapper mapper)
    : IQueryHandler<GetHabitEntriesQuery, IEnumerable<HabitEntryDto>>
{
    public async Task<Result<IEnumerable<HabitEntryDto>, IDomainError>> Handle(GetHabitEntriesQuery request,
        CancellationToken cancellationToken)
    {
        Guard.Against.Null(request, nameof(GetHabitEntriesQuery));
        
        DateTime? startDate = request.StartDate;
        DateTime? endDate = request.EndDate;
        
        // If month is provided, calculate start and end dates
        if (!string.IsNullOrEmpty(request.Month) && startDate == null && endDate == null)
        {
            var parts = request.Month.Split('-');
            if (parts.Length == 2 && int.TryParse(parts[0], out var year) && int.TryParse(parts[1], out var month))
            {
                startDate = new DateTime(year, month, 1);
                endDate = startDate.Value.AddMonths(1).AddDays(-1);
            }
        }
        
        var entries = await repository.GetByHabitIdAsync(request.HabitId, startDate, endDate, cancellationToken).ConfigureAwait(false);
        var dtos = mapper.Map<IEnumerable<HabitEntryDto>>(entries);
        
        return Result.Success<IEnumerable<HabitEntryDto>, IDomainError>(dtos);
    }
}