using CSharpFunctionalExtensions;
using MediatR;
using Momentum.Api.Abstractions;
using Momentum.Api.Constants;
using Momentum.Api.Extensions;
using Momentum.Application.Dtos.Habit;
using Momentum.Application.Habits.Get;
using Momentum.Domain.Errors;
using IResult = Microsoft.AspNetCore.Http.IResult;

namespace Momentum.Api.Endpoints;

internal sealed class Habits(IErrorHandler errorHandler) : EndpointGroupBase
{

    internal override void Map(WebApplication app)
    {
        errorHandler = Guard.Against.Null(errorHandler, nameof(errorHandler));
        app.MapGroup(nameof(Habits))
            .MapGet(GetHabits, string.Empty, Tags.Habits)
        //     .MapPost(CreateHabit, string.Empty, Tags.Habits)
        //     .MapPut("{id}", PatchHabit).WithTags(Tags.Habits);
    }
    
    private async Task<IResult> GetHabits(ISender sender, [AsParameters] GetHabitsQuery query)
    {
        Result<HabitDto, IDomainError> result = await sender.Send(query).ConfigureAwait(false);

        if (result.IsSuccess)
        {
            return Results.Ok(result.Value);
        }

        return errorHandler.HandleError(result.Error);
    }
}
