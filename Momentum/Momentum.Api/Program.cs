using System.Reflection;
using Asp.Versioning.Conventions;
using Microsoft.EntityFrameworkCore;
using Momentum.Api.Common;
using Momentum.Api.Extensions;
using Momentum.Application.Extensions;
using Momentum.Domain.Entities.Auth;
using Momentum.Infrastructure.Data;
using Momentum.Infrastructure.Extensions;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);
builder.Services.AddApiLayer().AddApplicationLayer().AddInfrastructureLayer(builder.Configuration);

builder.Services.AddProblemDetails();
builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<User>(options =>
    {
        options.Lockout.MaxFailedAccessAttempts = 20;
        options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
        options.Lockout.AllowedForNewUsers = true;
    })
    .AddEntityFrameworkStores<DataContext>();

WebApplication app = builder.Build();

// Apply migrations at runtime
using (IServiceScope scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<DataContext>();
    dbContext.Database.Migrate();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapGroup("/auth").MapIdentityApi<User>();
app.MapGet("/endpoints", (IEnumerable<EndpointDataSource> endpointSources) =>
{
    var endpoints = endpointSources
        .SelectMany(es => es.Endpoints)
        .OfType<RouteEndpoint>()
        .Select(e => new
        {
            Method = e.Metadata.GetMetadata<HttpMethodMetadata>()?.HttpMethods[0],
            Route = e.RoutePattern.RawText,
            Handler = e.Metadata.GetMetadata<MethodInfo>()?.Name ?? "Unknown"
        })
        .ToList();

    return Results.Ok(endpoints);
}).WithTags("Debug");

ApiVersioning.V1 = app.NewApiVersionSet()
    .HasApiVersion(1.0)
    .ReportApiVersions()
    .Build();
app.MapEndpoints();

app.Run();
