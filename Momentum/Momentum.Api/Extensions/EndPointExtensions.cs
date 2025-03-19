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
        // Type endpointGroupType = typeof(EndpointGroupBase);
        // var assembly = Assembly.GetExecutingAssembly();
        // IEnumerable<Type> endpointGroupTypes = assembly.GetTypes()
        //     .Where(t => t.IsSubclassOf(endpointGroupType));
        //
        // using IServiceScope scope = app.Services.CreateScope();
        // IServiceProvider scopedServices = scope.ServiceProvider;
        //
        // foreach (Type type in endpointGroupTypes)
        // {
        //     ConstructorInfo constructorInfo = type.GetConstructors().First();
        //     object[] parameters = constructorInfo.GetParameters()
        //         .Select(p => scopedServices.GetRequiredService(p.ParameterType))
        //         .ToArray();
        //
        //     var instance = (EndpointGroupBase)constructorInfo.Invoke(parameters);
        //     instance.Map(app);
        // }
        using IServiceScope scope = app.Services.CreateScope();
        IServiceProvider scopedServices = scope.ServiceProvider;

        // Get the error handler service
        var errorHandler = scopedServices.GetRequiredService<IErrorHandler>();

        // Manually create Users endpoint
        var usersEndpoint = new Users(errorHandler);
        usersEndpoint.Map(app);
        app.UseSwagger();
        app.UseSwaggerUI(options =>
        {
            options.SwaggerEndpoint("/swagger/v1/swagger.json", "Momentum API v1");
            options.RoutePrefix = string.Empty;
        });
        return app;
    }
}
