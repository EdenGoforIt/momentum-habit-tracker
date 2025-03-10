using CSharpFunctionalExtensions;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Momentum.Api.Abstractions;
using Momentum.Api.Constants;
using Momentum.Api.Infrastructure;
using Momentum.Application.Dtos.Users;
using Momentum.Application.Users.GetUser;
using Momentum.Domain.Errors;

namespace Momentum.Api.Endpoints;

internal sealed class Users : EndpointGroupBase
{
    internal override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .MapGet(GetUser, pattern: string.Empty, tag: Tags.Users);
        // .RequireAuthorization()
        // .MapPost(CreateTodoItem)
        // .MapPut(UpdateTodoItem, "{id}")
        // .MapPut(UpdateTodoItemDetail, "UpdateDetail/{id}")
        // .MapDelete(DeleteTodoItem, "{id}");
    }

    
    public async Task<Ok<UserDto>> GetUser(ISender sender,
        [AsParameters] GetUserQuery query)
    {
        Result<UserDto, IDomainError> result = await sender.Send(query);

        return TypedResults.Ok(result);
    }

}
