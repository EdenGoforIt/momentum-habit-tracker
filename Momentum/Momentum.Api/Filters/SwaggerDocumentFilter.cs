using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Momentum.Api.Filters;

[SuppressMessage("Performance", "CA1812:Avoid uninstantiated internal classes", Justification = "Used by Swagger")]
internal sealed class SwaggerDocumentFilter : IDocumentFilter
{
    public void Apply(OpenApiDocument swaggerDoc, DocumentFilterContext? context)
    {
        if (context == null)
        {
            return;
        }

        foreach (ApiDescription? apiDescription in context.ApiDescriptions)
        {
            if (apiDescription
                    .ActionDescriptor is ControllerActionDescriptor
                actionDescriptor) // This is a minimal API endpoint
            {
                continue;
            }

            // Ensure it has operation ID and other metadata
            string? route = apiDescription.RelativePath;
            string? httpMethod = apiDescription.HttpMethod;

            // Make sure there's an operation ID
            if (string.IsNullOrEmpty(apiDescription.GroupName))
            {
                apiDescription.GroupName = $"{httpMethod}_{route?.Replace("/", "_", StringComparison.Ordinal)}";
            }
        }
    }
}
