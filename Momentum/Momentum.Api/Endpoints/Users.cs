using System.Diagnostics.CodeAnalysis;
using CSharpFunctionalExtensions;
using MediatR;
using Microsoft.AspNetCore.JsonPatch;
using Momentum.Api.Abstractions;
using Momentum.Api.Common;
using Momentum.Api.Constants;
using Momentum.Api.Extensions;
using Momentum.Api.Wrappers;
using Momentum.Application.Dtos.Users;
using Momentum.Application.Users.Commands.CreateUser;
using Momentum.Application.Users.Patch;
using Momentum.Application.Users.Queries.GetUser;
using Momentum.Domain.Errors;
using IResult = Microsoft.AspNetCore.Http.IResult;

namespace Momentum.Api.Endpoints;

[SuppressMessage("Performance", "CA1812:Avoid uninstantiated internal classes",
    Justification = "Instantiated via Dependency Injection")]
internal sealed class Users(IErrorHandler errorHandler) : EndpointGroupBase
{
    internal override void Map(WebApplication app)
    {
        app.MapGroup("/api/v{version:apiVersion}/users")
            .MapGet(GetUser, "{id}", Tags.Users, ApiVersioning.V1)
            .MapPost(CreateUser, string.Empty, Tags.Users, ApiVersioning.V1)
            .MapPatch(PatchUser, "{id}", Tags.Users, ApiVersioning.V1);
    }

    private async Task<IResult> GetUser(ISender sender, [AsParameters] GetUserQuery query)
    {
        Result<UserDto, IDomainError> result = await sender.Send(query).ConfigureAwait(false);

        if (result.IsSuccess)
        {
            return Results.Ok(result.Value);
        }

        return errorHandler.HandleError(result.Error);
    }

    private async Task<IResult> CreateUser(ISender sender, CreateUserCommand command)
    {
        Result<string, IDomainError> result = await sender.Send(command).ConfigureAwait(false);

        if (result.IsSuccess)
        {
            var createdUser = new
            {
                UserName = result.Value
            };

            return Results.CreatedAtRoute(nameof(GetUser),
                new
                {
                    UserName = result.Value
                },
                createdUser
            );
        }

        return errorHandler.HandleError(result.Error);
    }

    private async Task<IResult> PatchUser(ISender sender, JsonPatchDocumentWrapper<PatchUserCommand> wrapper, string id)
    {
        JsonPatchDocument<PatchUserCommand>? patchDocument = wrapper.Value;

        if (patchDocument == null)
        {
            return Results.BadRequest("Invalid patch document");
        }

        // Fetch the existing user data (e.g., from the database)
        Result<UserDto, IDomainError> existingUserResult = await sender.Send(new GetUserQuery
        {
            Id = id
        }).ConfigureAwait(false);

        if (existingUserResult.IsFailure)
        {
            return errorHandler.HandleError(existingUserResult.Error);
        }

        UserDto? existingUser = existingUserResult.Value;
        // Map the existing user to the command object
        var command = new PatchUserCommand
        {
            Id = id, FirstName = existingUser.FirstName, LastName = existingUser.LastName
        };

        // Apply the patch
        patchDocument.ApplyTo(command);

        Result<Unit, IDomainError> result = await sender.Send(command).ConfigureAwait(false);

        return result.IsSuccess ? Results.NoContent() : errorHandler.HandleError(result.Error);
    }
}
