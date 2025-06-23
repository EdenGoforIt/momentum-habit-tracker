using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using Momentum.Application.Abstractions;
using Momentum.Application.Mappings;

namespace Momentum.Application.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationLayer(this IServiceCollection services)
    {
        services.AddMediatR(configuration =>
            configuration.RegisterServicesFromAssembly(typeof(ServiceCollectionExtensions).Assembly));

        // Auto Mapper Configurations
        var mappingConfig = new MapperConfiguration(mc =>
        {
            mc.AddProfile(new UserMapping());
            mc.AddProfile(new HabitMapping());
        });

        IMapper? mapper = mappingConfig.CreateMapper();
        services.AddSingleton(mapper);

        // Add FluentValidation
        services.AddValidatorsFromAssemblyContaining<AbstractLayer>();

        return services;
    }
}
