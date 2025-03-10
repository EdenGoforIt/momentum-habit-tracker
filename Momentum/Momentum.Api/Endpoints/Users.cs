using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Momentum.Api.Abstractions;
using Momentum.Api.Constants;
using Momentum.Api.Infrastructure;
using Momentum.Application.Dtos.Users;

namespace Momentum.Api.Endpoints;

internal sealed class Users : EndpointGroupBase
{
    internal override void Map(WebApplication app)
    {
        app.MapGroup(this)
            // .RequireAuthorization()
            .MapGet(GetUser)
        // .MapPost(CreateTodoItem)
        // .MapPut(UpdateTodoItem, "{id}")
        // .MapPut(UpdateTodoItemDetail, "UpdateDetail/{id}")
        // .MapDelete(DeleteTodoItem, "{id}");
    }

    
    public async Task<Ok<UserDto>>> GetUser(ISender sender,
        [AsParameters] GetTodoItemsWithPaginationQuery query)
    {
        var result = await sender.Send(query);

        return TypedResults.Ok(result);
    }

    public void MapEndpoint(IEndpointRouteBuilder app) => app.MapGet("users/{userId}",
        async (long userId, CancellationToken cancellationToken) =>
        {
            var user = await Task.FromResult(new { Id = userId, Name = "Test User" });

            return Results.Ok(user);
        }).WithTags(Tags.Users).MapToApiVersion(1);
}
