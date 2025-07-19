using System.Diagnostics.CodeAnalysis;
using CSharpFunctionalExtensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Momentum.Api.Abstractions;
using Momentum.Api.Common;
using Momentum.Api.Constants;
using Momentum.Api.Extensions;
using Momentum.Application.Dtos.Habit;
using Momentum.Application.HabitEntries.Create;
using Momentum.Application.HabitEntries.GetByHabit;
using Momentum.Application.HabitEntries.Update;
using Momentum.Domain.Errors;
using IResult = Microsoft.AspNetCore.Http.IResult;

namespace Momentum.Api.Endpoints;

[SuppressMessage("Performance", "CA1812:Avoid uninstantiated internal classes",
    Justification = "Instantiated via Dependency Injection")]
internal sealed class HabitEntries(IErrorHandler errorHandler) : EndpointGroupBase
{
    internal override void Map(WebApplication app)
    {
        app.MapGroup("/api/v{version:apiVersion}/habit-entries")
            .MapGet(GetHabitEntries, "habit/{habitId}", Tags.HabitEntries, ApiVersioning.V1)
            .MapPost(CreateHabitEntry, string.Empty, Tags.HabitEntries, ApiVersioning.V1)
            .MapPut(UpdateHabitEntry, "{entryId}", Tags.HabitEntries, ApiVersioning.V1);
    }

    private async Task<IResult> GetHabitEntries(ISender sender, [AsParameters] GetHabitEntriesQuery query)
    {
        Result<IEnumerable<HabitEntryDto>, IDomainError> result = await sender.Send(query).ConfigureAwait(false);

        if (result.IsSuccess)
        {
            return Results.Ok(result.Value);
        }

        return errorHandler.HandleError(result.Error);
    }

    private async Task<IResult> CreateHabitEntry(ISender sender, [FromBody] HabitEntryDto entryDto)
    {
        var command = new CreateHabitEntryCommand
        {
            HabitEntryDto = entryDto
        };

        Result<long, IDomainError> result = await sender.Send(command).ConfigureAwait(false);

        if (result.IsSuccess)
        {
            return Results.CreatedAtRoute(nameof(GetHabitEntries),
                new { habitId = entryDto.HabitId },
                new { Id = result.Value });
        }

        return errorHandler.HandleError(result.Error);
    }

    private async Task<IResult> UpdateHabitEntry(ISender sender, long entryId, [FromBody] HabitEntryDto entryDto)
    {
        var command = new UpdateHabitEntryCommand
        {
            EntryId = entryId,
            HabitEntryDto = entryDto
        };

        Result<Unit, IDomainError> result = await sender.Send(command).ConfigureAwait(false);

        if (result.IsSuccess)
        {
            return Results.NoContent();
        }

        return errorHandler.HandleError(result.Error);
    }
}