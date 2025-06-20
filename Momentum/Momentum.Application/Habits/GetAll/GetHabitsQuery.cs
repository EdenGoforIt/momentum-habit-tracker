using Microsoft.EntityFrameworkCore;
using Momentum.Application.Abstractions;
using Momentum.Application.Dtos.Habit;
using Momentum.Domain.Errors;

namespace Momentum.Application.Habits.GetAll;

// ReSharper disable once ClassNeverInstantiated.Global
public class GetHabitsQuery : IQuery<IEnumerable<HabitDto>>
{
    public required string UserId { get; set; }
}

// ReSharper disable once HollowTypeName
public class GetHabitsQueryHandler(IHabitRepository repository, IMapper mapper)
    : IQueryHandler<GetHabitsQuery, IEnumerable<HabitDto>>
{
    public async Task<Result<IEnumerable<HabitDto>, IDomainError>> Handle(GetHabitsQuery request,
        CancellationToken cancellationToken)
    {
        Guard.Against.Null(request);

        IEnumerable<HabitDto> habits = await repository.GetAllByUserId(request.UserId)
            .Select(h => mapper.Map<HabitDto>(h))
            .ToListAsync(cancellationToken: cancellationToken).ConfigureAwait(false);

        return Result.Success<IEnumerable<HabitDto>, IDomainError>(habits);
    }
}
