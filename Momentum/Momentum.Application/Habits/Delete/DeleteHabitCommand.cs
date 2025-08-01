using Momentum.Application.Abstractions;
using Momentum.Domain.Errors;

namespace Momentum.Application.Habits.Delete;

public class DeleteHabitCommand : ICommand<bool>
{
	public required long HabitId { get; init; }
	public required string UserId { get; init; }
}

// ReSharper disable once HollowTypeName
public class DeleteHabitCommandHandler(IHabitRepository repository)
		: ICommandHandler<DeleteHabitCommand, bool>
{
	public async Task<Result<bool, IDomainError>> Handle(DeleteHabitCommand request,
			CancellationToken cancellationToken)
	{
		Guard.Against.Null(request, nameof(DeleteHabitCommand));

		if (!await repository.DoesHabitBelongToUserAsync(request.HabitId, request.UserId, cancellationToken)
						.ConfigureAwait(false))
		{
			return Result.Failure<bool, IDomainError>(DomainError.NotFound(
					$"The habit with Id {request.HabitId} was not found for the user with Id {request.UserId}."));
		}

		var habit = repository.GetById(request.HabitId).FirstOrDefault();

		if (habit == null)
		{
			return Result.Failure<bool, IDomainError>(DomainError.NotFound(
					$"The habit with Id {request.HabitId} was not found."));
		}

		repository.Delete(habit);
		await repository.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

		return Result.Success<bool, IDomainError>(true);
	}
}