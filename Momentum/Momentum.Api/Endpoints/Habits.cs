using System.Diagnostics.CodeAnalysis;
using CSharpFunctionalExtensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Momentum.Api.Abstractions;
using Momentum.Api.Constants;
using Momentum.Api.Extensions;
using Momentum.Application.Dtos.Habit;
using Momentum.Application.Habits.Create;
using Momentum.Application.Habits.GetAll;
using Momentum.Domain.Errors;
using IResult = Microsoft.AspNetCore.Http.IResult;

namespace Momentum.Api.Endpoints;

[SuppressMessage("Performance", "CA1812:Avoid uninstantiated internal classes",
    Justification = "Instantiated via Dependency Injection")]
internal sealed class Habits(IErrorHandler errorHandler) : EndpointGroupBase
{
    private IErrorHandler _errorHandler = errorHandler;

    internal override void Map(WebApplication app)
    {
        _errorHandler = Guard.Against.Null(_errorHandler, nameof(errorHandler));
        app.MapGroup(nameof(Habits))
            .MapGet(GetHabits, "{userId}", Tags.Habits)
            .MapPost(CreateHabit, string.Empty, Tags.Habits);
        //     .MapPut("{id}", PatchHabit).WithTags(Tags.Habits);
    }

    private async Task<IResult> GetHabits(string userId, ISender sender, [AsParameters] GetHabitsQuery query)
    {
        Result<IEnumerable<HabitDto>, IDomainError> result = await sender.Send(query).ConfigureAwait(false);

        if (result.IsSuccess)
        {
            return Results.Ok(result.Value);
        }

        return _errorHandler.HandleError(result.Error);
    }

    private async Task<IResult> CreateHabit(ISender sender, [FromBody] HabitDto habitDto)
    {
        var command = new CreateHabitCommand
        {
            HabitDto = habitDto
        };

        Result<long, IDomainError> result = await sender.Send(command).ConfigureAwait(false);

        if (result.IsSuccess)
        {
            // TODO: return Created Route
            return Results.Ok(result.Value);
        }

        return _errorHandler.HandleError(result.Error);
    }
}
