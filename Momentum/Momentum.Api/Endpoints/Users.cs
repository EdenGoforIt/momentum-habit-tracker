using System.Diagnostics.CodeAnalysis;
using CSharpFunctionalExtensions;
using MediatR;
using Momentum.Api.Abstractions;
using Momentum.Api.Constants;
using Momentum.Api.Extensions;
using Momentum.Application.Dtos.Users;
using Momentum.Application.Users.Commands.CreateUser;
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
        app.MapGroup(nameof(Users))
            .WithApiVersionSet()
            .MapToApiVersion(1.0)
            .MapGet(GetUser, "{id}", Tags.Users)
            .MapPost(CreateUser, string.Empty, Tags.Users);
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
        Result<long, IDomainError> result = await sender.Send(command).ConfigureAwait(false);

        if (result.IsSuccess)
        {
            var createdUser = new
            {
                Id = result.Value
            };

            return Results.CreatedAtRoute(nameof(GetUser),
                new
                {
                    id = result.Value
                },
                createdUser
            );
        }

        return errorHandler.HandleError(result.Error);
    }
}
