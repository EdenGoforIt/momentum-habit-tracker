using System.Diagnostics.CodeAnalysis;
using CSharpFunctionalExtensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Momentum.Api.Abstractions;
using Momentum.Api.Common;
using Momentum.Api.Constants;
using Momentum.Api.Extensions;
using Momentum.Application.Categories.Queries;
using Momentum.Application.Dtos.Habit;
using Momentum.Domain.Errors;
using IResult = Microsoft.AspNetCore.Http.IResult;

namespace Momentum.Api.Endpoints;

[SuppressMessage("Performance", "CA1812:Avoid uninstantiated internal classes",
    Justification = "Instantiated via Dependency Injection")]
internal sealed class Categories(IErrorHandler errorHandler) : EndpointGroupBase
{
    internal override void Map(WebApplication app)
    {
        app.MapGroup("/api/v{version:apiVersion}/categories")
            .MapGet(GetCategories, string.Empty, Tags.Categories, ApiVersioning.V1);
    }

    private async Task<IResult> GetCategories(ISender sender, [AsParameters] GetCategoriesQuery query)
    {
        Result<IEnumerable<CategoryDto>, IDomainError> result = await sender.Send(query).ConfigureAwait(false);

        if (result.IsSuccess)
        {
            return Results.Ok(result.Value);
        }

        return errorHandler.HandleError(result.Error);
    }
}