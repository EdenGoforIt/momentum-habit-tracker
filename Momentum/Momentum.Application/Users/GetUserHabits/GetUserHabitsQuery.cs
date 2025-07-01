using Microsoft.EntityFrameworkCore;
using Momentum.Application.Abstractions;
using Momentum.Application.Dtos.Habit;
using Momentum.Domain.Enums;
using Momentum.Domain.Errors;

namespace Momentum.Application.Users.GetUserHabits;

// ReSharper disable once ClassNeverInstantiated.Global
public class GetUserHabitsQuery : IQuery<IEnumerable<HabitDto>>
{
    public required string UserId { get; set; }
}

// ReSharper disable once HollowTypeName
public class GetUserHabitsQueryHandler(IHabitRepository repository, IMapper mapper)
    : IQueryHandler<GetUserHabitsQuery, IEnumerable<HabitDto>>
{
    public async Task<Result<IEnumerable<HabitDto>, IDomainError>> Handle(GetUserHabitsQuery request,
        CancellationToken cancellationToken)
    {
        Guard.Against.Null(request);

        IEnumerable<HabitDto> habits = await repository.GetAllByUserId(request.UserId)
            .Select(h => mapper.Map<HabitDto>(h))
            .ToListAsync(cancellationToken: cancellationToken).ConfigureAwait(false);

        return Result.Success<IEnumerable<HabitDto>, IDomainError>(habits);
    }
}
