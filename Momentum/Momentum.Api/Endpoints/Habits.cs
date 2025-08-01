using System.Diagnostics.CodeAnalysis;
using CSharpFunctionalExtensions;
using MediatR;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Momentum.Api.Abstractions;
using Momentum.Api.Common;
using Momentum.Api.Constants;
using Momentum.Api.Extensions;
using Momentum.Api.Wrappers;
using Momentum.Application.Dtos.Habit;
using Momentum.Application.Habits.Create;
using Momentum.Application.Habits.GetHabit;
using Momentum.Application.Habits.Patch;
using Momentum.Application.Habits.Update;
using Momentum.Application.Habits.Delete;
using Momentum.Domain.Errors;
using IResult = Microsoft.AspNetCore.Http.IResult;

namespace Momentum.Api.Endpoints;

[SuppressMessage("Performance", "CA1812:Avoid uninstantiated internal classes",
    Justification = "Instantiated via Dependency Injection")]
// ReSharper disable once CapturedPrimaryConstructorParameterIsMutable
internal sealed class Habits(IErrorHandler errorHandler) : EndpointGroupBase
{
    internal override void Map(WebApplication app)
    {
        app.MapGroup("/api/v{version:apiVersion}/habits")
            // .RequireAuthorization()
            .MapGet(GetHabit, "{habitId}", Tags.Habits, ApiVersioning.V1)
            .MapPost(CreateHabit, string.Empty, Tags.Habits, ApiVersioning.V1)
            .MapPut(UpdateHabit, "{habitId}", Tags.Habits)
            .MapPatch(PatchHabit, "{habitId}", Tags.Habits, ApiVersioning.V1)
            .MapDelete(DeleteHabit, "{habitId}", Tags.Habits, ApiVersioning.V1);
    }

    private async Task<IResult> GetHabit(ISender sender, [AsParameters] GetHabitQuery query)
    {
        Result<HabitDto, IDomainError> result = await sender.Send(query).ConfigureAwait(false);

        if (result.IsSuccess)
        {
            return Results.Ok(result.Value);
        }

        return errorHandler.HandleError(result.Error);
    }

    private async Task<IResult> PatchHabit(ISender sender, long habitId,
        [FromBody] JsonPatchDocumentWrapper<PatchHabitCommand> wrapper)
    {
        JsonPatchDocument<PatchHabitCommand>? patchDocument = wrapper.Value;

        if (patchDocument == null)
        {
            return Results.BadRequest("Invalid patch document");
        }

        // Fetch the existing user data (e.g., from the database)
        Result<HabitDto, IDomainError> existingHabitResult = await sender.Send(new GetHabitQuery
        {
            HabitId = habitId
        }).ConfigureAwait(false);

        if (existingHabitResult.IsFailure)
        {
            return errorHandler.HandleError(existingHabitResult.Error);
        }

        HabitDto? existingHabit = existingHabitResult.Value;

        var command = new PatchHabitCommand
        {
            HabitId = habitId,
            Name = existingHabit.Name,
            Description = existingHabit.Description,
            CategoryId = existingHabit.CategoryId
        };
        // Apply the patch
        patchDocument.ApplyTo(command);

        Result<long, IDomainError> result = await sender.Send(command).ConfigureAwait(false);

        if (result.IsSuccess)
        {
            return Results.CreatedAtRoute(nameof(GetHabit),
                new
                {
                    habitId = existingHabit.Id
                },
                existingHabit
            );
        }

        return errorHandler.HandleError(result.Error);
    }

    private async Task<IResult> UpdateHabit(ISender sender, long habitId, [FromBody] HabitDto habitDto)
    {
        var command = new UpdateHabitCommand
        {
            HabitId = habitId, HabitDto = habitDto
        };

        Result<long, IDomainError> result = await sender.Send(command).ConfigureAwait(false);

        if (result.IsSuccess)
        {
            return Results.CreatedAtRoute(nameof(GetHabit),
                new
                {
                    habitId = habitDto.Id
                },
                habitDto
            );
        }

        return errorHandler.HandleError(result.Error);
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
            return Results.CreatedAtRoute(nameof(GetHabit),
                new
                {
                    habitId = habitDto.Id
                },
                habitDto
            );
        }

        return errorHandler.HandleError(result.Error);
    }

    private async Task<IResult> DeleteHabit(ISender sender, long habitId, string userId)
    {
        var command = new DeleteHabitCommand
        {
            HabitId = habitId,
            UserId = userId
        };

        Result<bool, IDomainError> result = await sender.Send(command).ConfigureAwait(false);

        if (result.IsSuccess)
        {
            return Results.NoContent();
        }

        return errorHandler.HandleError(result.Error);
    }
}
