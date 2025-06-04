using System.Reflection;
using Microsoft.AspNetCore.Http.Json;
using Microsoft.EntityFrameworkCore;
using Momentum.Api.Extensions;
using Momentum.Application.Extensions;
using Momentum.Domain.Entities.Auth;
using Momentum.Infrastructure.Data;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);
builder.Services.AddApplicationLayer();
builder.Services.AddServices();
builder.Services.AddProblemDetails();
builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<User>()
    .AddEntityFrameworkStores<DataContext>();
// Configure System.Text.Json to handle JsonPatch
builder.Services.Configure<JsonOptions>(options =>
{
    options.SerializerOptions.PropertyNamingPolicy = null;
    options.SerializerOptions.PropertyNameCaseInsensitive = true;
});

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

app.MapEndpoints();

app.Run();
