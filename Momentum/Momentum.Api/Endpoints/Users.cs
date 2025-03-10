using CSharpFunctionalExtensions;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Momentum.Api.Abstractions;
using Momentum.Api.Constants;
using Momentum.Api.Infrastructure;
using Momentum.Application.Dtos.Users;
using Momentum.Application.Users.GetUser;
using Momentum.Domain.Errors;

namespace Momentum.Api.Endpoints;

internal sealed class Users(IErrorHandler errorHandler) : EndpointGroupBase
{
    internal override void Map(WebApplication app) => app.MapGroup(this)
        .MapGet(GetUser, pattern: string.Empty, tag: Tags.Users);

    private async Task<IActionResult> GetUser(ISender sender,
        [AsParameters] GetUserQuery query)
    {
        Result<UserDto, IDomainError> result = await sender.Send(query);

        if (result.IsSuccess)
        {
            return (IActionResult)Results.Ok(result.Value);
        }
        else
        {
            return errorHandler.HandleError(result.Error);
        }
    }
}
