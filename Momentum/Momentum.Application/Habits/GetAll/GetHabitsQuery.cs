using Microsoft.EntityFrameworkCore;
using Momentum.Application.Abstractions;
using Momentum.Application.Dtos.Habit;
using Momentum.Domain.Errors;
using Momentum.Infrastructure.Data;

namespace Momentum.Application.Habits.GetAll;

public abstract class GetHabitsQuery : IQuery<IEnumerable<HabitDto>>
{
    public required string UserId { get; set; }
}

// ReSharper disable once HollowTypeName
public class GetHabitsQueryHandler(DataContext context, IMapper mapper)
    : IQueryHandler<GetHabitsQuery, IEnumerable<HabitDto>>
{
    private readonly IMapper _mapper = Guard.Against.Null(mapper, nameof(IMapper));
    private readonly DataContext _context = Guard.Against.Null(context, nameof(AppContext));

    public async Task<Result<IEnumerable<HabitDto>, IDomainError>> Handle(GetHabitsQuery request,
        CancellationToken cancellationToken)
    {
        Guard.Against.Null(request);
        IEnumerable<HabitDto> habits = await _context.Habits
            .Where(x => x.UserId == request.UserId)
            .Select(h => _mapper.Map<HabitDto>(h))
            .ToListAsync(cancellationToken: cancellationToken).ConfigureAwait(false);

        return Result.Success<IEnumerable<HabitDto>, IDomainError>(habits);
    }
}
