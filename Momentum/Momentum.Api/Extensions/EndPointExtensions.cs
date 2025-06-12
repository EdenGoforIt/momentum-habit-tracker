using System.Globalization;
using Momentum.Api.Abstractions;
using Momentum.Api.Endpoints;

namespace Momentum.Api.Extensions;

internal static class EndPointExtensions
{
    public static RouteGroupBuilder MapGroup(this WebApplication app, EndpointGroupBase group)
    {
#pragma warning disable CA1308
        string groupName = group.GetType().Name.ToLower(CultureInfo.InvariantCulture);
#pragma warning restore CA1308

        return app
            .MapGroup($"/api/v{{version:apiVersion}}/{groupName}")
            .WithGroupName(groupName)
            .WithTags(groupName)
            .WithOpenApi();
    }

    public static WebApplication MapEndpoints(this WebApplication app)
    {
        ConfigureEndpoints(app);
        ConfigureSwagger(app);
        return app;
    }

    private static void ConfigureEndpoints(WebApplication app)
    {
        using IServiceScope scope = app.Services.CreateScope();
        IServiceProvider scopedServices = scope.ServiceProvider;

        // Get the error handler service
        var errorHandler = scopedServices.GetRequiredService<IErrorHandler>();

        // Manually create Users endpoint
        var usersEndpoint = new Users(errorHandler);
        var habitsEndpoint = new Habits(errorHandler);

        usersEndpoint.Map(app);
        habitsEndpoint.Map(app);
    }

    private static void ConfigureSwagger(WebApplication app)
    {
        app.UseSwagger();
        app.UseSwaggerUI(options =>
        {
            options.SwaggerEndpoint("/swagger/v1/swagger.json", "Momentum API v1");
            options.RoutePrefix = string.Empty;
        });
    }
}
