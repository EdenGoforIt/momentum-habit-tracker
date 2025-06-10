using Momentum.Application.Abstractions;
using Momentum.Application.Dtos.Habit;
using Momentum.Domain.Errors;
using Momentum.Infrastructure.Data;

namespace Momentum.Application.Habits.GetAll;

public abstract class GetHabitsQuery : IQuery<IEnumerable<HabitDto>>
{
    public required string Id { get; set; }
}

// ReSharper disable once HollowTypeName
public class GetHabitsQueryHandler(DataContext context, IMapper mapper)
    : IQueryHandler<GetHabitsQuery, IEnumerable<HabitDto>>
{
    private readonly IMapper _mapper = Guard.Against.Null(mapper, nameof(IMapper));
    private readonly DataContext _context = Guard.Against.Null(context, nameof(AppContext));
    public Task<Result<IEnumerable<HabitDto>, IDomainError>> Handle(GetHabitsQuery request,
        CancellationToken cancellationToken)
    {
    }
}
