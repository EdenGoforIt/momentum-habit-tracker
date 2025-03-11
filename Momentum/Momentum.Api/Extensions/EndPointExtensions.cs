using System.Globalization;
using System.Reflection;
using Momentum.Api.Abstractions;

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
        Type endpointGroupType = typeof(EndpointGroupBase);
        var assembly = Assembly.GetExecutingAssembly();
        IEnumerable<Type> endpointGroupTypes = assembly.GetTypes()
            .Where(t => t.IsSubclassOf(endpointGroupType));

        using IServiceScope scope = app.Services.CreateScope();
        IServiceProvider scopedServices = scope.ServiceProvider;

        foreach (Type type in endpointGroupTypes)
        {
            ConstructorInfo constructorInfo = type.GetConstructors().First();
            object[] parameters = constructorInfo.GetParameters()
                .Select(p => scopedServices.GetRequiredService(p.ParameterType))
                .ToArray();

            var instance = (EndpointGroupBase)constructorInfo.Invoke(parameters);
            instance.Map(app);
        }

        return app;
    }
}
