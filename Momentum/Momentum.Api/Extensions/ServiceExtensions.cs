using System.Reflection;
using Asp.Versioning;
using Microsoft.OpenApi.Models;
using Momentum.Api.Abstractions;
using Momentum.Api.Handlers;
using Swashbuckle.AspNetCore.Filters;

namespace Momentum.Api.Extensions;

internal static class ServiceExtensions
{
    internal static IServiceCollection AddApiLayer(this IServiceCollection services)
    {
        services.AddHttpContextAccessor();
        services.AddScoped<IErrorHandler, ErrorHandler>();
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));
        services.AddSwagger();

        return services;
    }

    private static IServiceCollection AddSwagger(this IServiceCollection services)
    {
        services.AddApiVersioning(options =>
        {
            options.DefaultApiVersion = new ApiVersion(1);
            options.ApiVersionReader = new UrlSegmentApiVersionReader();
        }).AddMvc().AddApiExplorer(options =>
        {
            options.GroupNameFormat = "'v'V";
            options.SubstituteApiVersionInUrl = true;
        });
        services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "Momentum API", Version = "v1"
            });
            options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                In = ParameterLocation.Header, Name = "Authorization", Type = SecuritySchemeType.ApiKey
            });

            options.OperationFilter<SecurityRequirementsOperationFilter>();
        });
        services.AddEndpointsApiExplorer();

        return services;
    }
}
