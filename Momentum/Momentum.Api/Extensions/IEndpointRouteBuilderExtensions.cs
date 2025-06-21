using System.Diagnostics.CodeAnalysis;
using Asp.Versioning.Builder;
using Momentum.Api.Common;

namespace Momentum.Api.Extensions;

internal static class EndpointRouteBuilderExtensions
{
    internal static IEndpointRouteBuilder MapGet(this IEndpointRouteBuilder builder, Delegate handler,
        [StringSyntax("Route")] string pattern = "", string tag = "", ApiVersionSet? apiVersion = null)
    {
        Guard.Against.AnonymousMethod(handler);
        apiVersion ??= ApiVersioning.V1!;

        builder.MapGet(pattern, handler)
            .WithName(handler.Method.Name)
            .WithTags(tag)
            .WithApiVersionSet(apiVersion!);

        return builder;
    }

    internal static IEndpointRouteBuilder MapPost(this IEndpointRouteBuilder builder, Delegate handler,
        [StringSyntax("Route")] string pattern = "", string tag = "", ApiVersionSet? apiVersion = null)
    {
        Guard.Against.AnonymousMethod(handler);
        apiVersion ??= ApiVersioning.V1!;

        builder.MapPost(pattern, handler)
            .WithName(handler.Method.Name)
            .WithTags(tag)
            .WithApiVersionSet(apiVersion);

        return builder;
    }

    internal static IEndpointRouteBuilder MapPut(this IEndpointRouteBuilder builder, Delegate handler,
        [StringSyntax("Route")] string pattern = "", string tag = "", ApiVersionSet? apiVersion = null)
    {
        Guard.Against.AnonymousMethod(handler);
        apiVersion ??= ApiVersioning.V1!;
        builder.MapPut(pattern, handler)
            .WithName(handler.Method.Name)
            .WithTags(tag)
            .WithApiVersionSet(apiVersion);

        return builder;
    }

    internal static IEndpointRouteBuilder MapPatch(this IEndpointRouteBuilder builder, Delegate handler,
        [StringSyntax("Route")] string pattern = "", string tag = "", ApiVersionSet? apiVersion = null)
    {
        Guard.Against.AnonymousMethod(handler);
        apiVersion ??= ApiVersioning.V1!;
        builder.MapPatch(pattern, handler)
            .WithName(handler.Method.Name)
            .WithTags(tag)
            .WithApiVersionSet(apiVersion);

        return builder;
    }

    internal static IEndpointRouteBuilder MapDelete(this IEndpointRouteBuilder builder, Delegate handler,
        [StringSyntax("Route")] string pattern = "", string tag = "", ApiVersionSet? apiVersion = null)
    {
        Guard.Against.AnonymousMethod(handler);
        apiVersion ??= ApiVersioning.V1!;
        builder.MapDelete(pattern, handler)
            .WithName(handler.Method.Name)
            .WithTags(tag)
            .WithApiVersionSet(apiVersion);

        return builder;
    }
}
