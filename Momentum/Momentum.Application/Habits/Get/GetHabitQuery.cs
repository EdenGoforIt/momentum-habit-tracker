using Microsoft.EntityFrameworkCore;
using Momentum.Application.Abstractions;
using Momentum.Application.Dtos.Habit;
using Momentum.Domain.Entities.Habits;
using Momentum.Domain.Errors;

namespace Momentum.Application.Habits.GetHabit;

// ReSharper disable once ClassNeverInstantiated.Global
public class GetHabitQuery : IQuery<HabitDto>
{
    public required long HabitId { get; set; }
}

// ReSharper disable once HollowTypeName
public class GetHabitQueryHandler(IHabitRepository repository, IMapper mapper)
    : IQueryHandler<GetHabitQuery, HabitDto>
{
    public async Task<Result<HabitDto, IDomainError>> Handle(GetHabitQuery request,
        CancellationToken cancellationToken)
    {
        Guard.Against.Null(request);

        Habit? habit = await repository.GetById(request.HabitId)
            .FirstOrDefaultAsync(cancellationToken: cancellationToken).ConfigureAwait(true);

        if (habit is null)
        {
            return Result.Failure<HabitDto, IDomainError>(
                DomainError.NotFound($"Habit with ID {request.HabitId} not found."));
        }

        var habitDto = mapper.Map<HabitDto>(habit);

        return Result.Success<HabitDto, IDomainError>(habitDto);
    }
}
