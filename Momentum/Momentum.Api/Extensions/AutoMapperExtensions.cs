using System.Reflection;
using Momentum.Application.Mappings;

namespace Momentum.Api.Extensions;

internal static class AutoMapperExtensions
{
    internal static IServiceCollection AddAutoMapper(this IServiceCollection services)
    {
        services.AddAutoMapper(cfg =>
        {
            cfg.AddMaps(Assembly.GetExecutingAssembly());
            cfg.AddMaps(Assembly.GetAssembly(typeof(UserMapping))!);
        });

        return services;
    }
}
