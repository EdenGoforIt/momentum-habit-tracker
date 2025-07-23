using Microsoft.EntityFrameworkCore;
using Momentum.Application.Abstractions;
using Momentum.Application.Dtos.Habit;
using Momentum.Domain.Entities.Habits;
using Momentum.Domain.Errors;

namespace Momentum.Application.Users.GetUserHabits;

// ReSharper disable once ClassNeverInstantiated.Global
public class GetUserHabitsQuery : IQuery<IEnumerable<HabitDto>>
{
    public required string UserId { get; set; }
    public DateTime? Date { get; set; }
    public string? Month { get; set; } // Format: YYYY-MM
}

// ReSharper disable once HollowTypeName
public class GetUserHabitsQueryHandler(IHabitRepository repository, IMapper mapper)
    : IQueryHandler<GetUserHabitsQuery, IEnumerable<HabitDto>>
{
    public async Task<Result<IEnumerable<HabitDto>, IDomainError>> Handle(GetUserHabitsQuery request,
        CancellationToken cancellationToken)
    {
        Guard.Against.Null(request);

        IQueryable<Habit?> query = repository.GetAllByUserId(request.UserId);

        if (request.Date is not null)
        {
            // ReSharper disable once ComplexConditionExpression
            query = query.Where(h =>
                h!.StartDate <= request.Date &&
                h.EndDate != null &&
                (h.EndDate == null || h.EndDate >= request.Date));
        }
        else if (!string.IsNullOrEmpty(request.Month))
        {
            // Parse month string (YYYY-MM) to get start and end dates
            var parts = request.Month.Split('-');
            if (parts.Length == 2 && int.TryParse(parts[0], out var year) && int.TryParse(parts[1], out var month))
            {
                var startOfMonth = new DateTime(year, month, 1);
                var endOfMonth = startOfMonth.AddMonths(1).AddDays(-1);

                query = query.Where(h =>
                    h!.StartDate <= endOfMonth &&
                    (h.EndDate == null || h.EndDate >= startOfMonth));
            }
        }

        IEnumerable<HabitDto> habits = await query
            .Select(h => mapper.Map<HabitDto>(h))
            .ToListAsync(cancellationToken)
            .ConfigureAwait(false);

        return Result.Success<IEnumerable<HabitDto>, IDomainError>(habits);
    }
}
