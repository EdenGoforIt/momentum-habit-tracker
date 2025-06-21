using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Momentum.Application.Abstractions;
using Momentum.Infrastructure.Data;
using Momentum.Infrastructure.Repositories;

namespace Momentum.Infrastructure.Extensions;

public static class ServiceExtensions
{
    public static IServiceCollection AddInfrastructureLayer(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<DataContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));
        services.TryAddScoped<IHabitRepository, HabitRepository>();
        services.TryAddScoped<IUserRepository, UserRepository>();
        return services;
    }
}
