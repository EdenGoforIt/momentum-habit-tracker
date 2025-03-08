using Momentum.Api.Abstractions;
using Momentum.Api.Constants;

namespace Momentum.Api.Endpoints.Users;

internal sealed class GetUser : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app) => app.MapGet("users/{userId}",
        async (long userId, CancellationToken cancellationToken) =>
        {
            var user = await Task.FromResult(new { Id = userId, Name = "Test User" });

            return Results.Ok(user);
        }).WithTags(Tags.Users).MapToApiVersion(1);
}
