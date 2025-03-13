using System.Diagnostics.CodeAnalysis;
using Ardalis.GuardClauses;

namespace Momentum.Api.Extensions;

internal static class EndpointRouteBuilderExtensions
{
    internal static IEndpointRouteBuilder MapGet(this IEndpointRouteBuilder builder, Delegate handler,
        [StringSyntax("Route")] string pattern = "", string tag = "")
    {
        Guard.Against.AnonymousMethod(handler);

        builder.MapGet(pattern, handler)
            .WithName(handler.Method.Name)
            .WithTags(tag)
            .WithOpenApi();

        return builder;
    }

    internal static IEndpointRouteBuilder MapPost(this IEndpointRouteBuilder builder, Delegate handler,
        [StringSyntax("Route")] string pattern = "", string tag = "")
    {
        Guard.Against.AnonymousMethod(handler);

        builder.MapPost(pattern, handler)
            .WithName(handler.Method.Name)
            .WithTags(tag)
            .WithOpenApi();

        return builder;
    }

    internal static IEndpointRouteBuilder MapPut(this IEndpointRouteBuilder builder, Delegate handler,
        [StringSyntax("Route")] string pattern = "", string tag = "", double version = 1.0)
    {
        Guard.Against.AnonymousMethod(handler);

        builder.MapPut(pattern, handler)
            .WithName(handler.Method.Name)
            .WithTags(tag)
            .MapToApiVersion(version);

        return builder;
    }

    internal static IEndpointRouteBuilder MapDelete(this IEndpointRouteBuilder builder, Delegate handler,
        [StringSyntax("Route")] string pattern = "", string tag = "", double version = 1.0)
    {
        Guard.Against.AnonymousMethod(handler);

        builder.MapDelete(pattern, handler)
            .WithName(handler.Method.Name)
            .WithTags(tag)
            .MapToApiVersion(version);

        return builder;
    }
}
