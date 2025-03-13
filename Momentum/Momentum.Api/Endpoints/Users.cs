using CSharpFunctionalExtensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Momentum.Api.Abstractions;
using Momentum.Api.Constants;
using Momentum.Api.Extensions;
using Momentum.Application.Dtos.Users;
using Momentum.Application.Users.Queries.GetUser;
using Momentum.Domain.Errors;

namespace Momentum.Api.Endpoints;

internal sealed class Users(IErrorHandler errorHandler) : EndpointGroupBase
{
    internal override void Map(WebApplication app) => app.MapGroup(this)
        .WithApiVersionSet()
        .MapToApiVersion(1.0)
        .MapGet(GetUser, "{id}", Tags.Users);

    private async Task<IActionResult> GetUser(ISender sender,
        [AsParameters] GetUserQuery query)
    {
        Result<UserDto, IDomainError> result = await sender.Send(query);

        if (result.IsSuccess)
        {
            return (IActionResult)Results.Ok(result.Value);
        }

        return errorHandler.HandleError(result.Error);
    }
    
    private async Task<IActionResult> CreateUser(ISender sender,
        [AsParameters] CreateUserQuery query)
    {
        Result<UserDto, IDomainError> result = await sender.Send(query);

        if (result.IsSuccess)
        {
            return (IActionResult)Results.Ok(result.Value);
        }

        return errorHandler.HandleError(result.Error);
    }
}
