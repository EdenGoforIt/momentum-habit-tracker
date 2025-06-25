using System.Globalization;
using Microsoft.EntityFrameworkCore;
using Momentum.Application.Abstractions;
using Momentum.Domain.Entities.Habits;
using Momentum.Domain.Errors;

namespace Momentum.Application.Habits.Patch;

// ReSharper disable once ClassNeverInstantiated.Global
public class PatchHabitCommand : ICommand<long>
{
    public required long HabitId { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public long? CategoryId { get; set; }
}

// ReSharper disable once HollowTypeName
public class PatchHabitCommandHandler(IHabitRepository repository)
    : ICommandHandler<PatchHabitCommand, long>
{
    private readonly IHabitRepository _repository = Guard.Against.Null(repository, nameof(repository));
#pragma warning restore CA1859

    public async Task<Result<long, IDomainError>> Handle(PatchHabitCommand request,
        CancellationToken cancellationToken)
    {
        Guard.Against.Null(request, nameof(PatchHabitCommand));

        Habit? habit = await _repository.GetById(request.HabitId).FirstOrDefaultAsync(cancellationToken)
            .ConfigureAwait(false);

        if (habit == null)
        {
            throw new NotFoundException(request.HabitId.ToString(CultureInfo.InvariantCulture), "Habit");
        }

        habit.Name = request.Name ?? habit.Name;
        habit.Description = request.Description ?? habit.Description;
        habit.CategoryId = request.CategoryId ?? habit.CategoryId;

        _repository.Update(habit);

        return request.HabitId;
    }
}
