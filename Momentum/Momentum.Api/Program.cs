using System.Reflection;
using Microsoft.OpenApi.Models;
using Momentum.Api.Extensions;
using Momentum.Application.Extensions;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);
builder.Services.AddApplicationLayer();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSwaggerGen(options =>
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "Momentum API", Version = "v1" }));
builder.Services.AddServices();

// After app.UseSwagger();

WebApplication app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options => options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1"));

    // app.UseSwaggerUI();
}

app.UseHttpsRedirection();
// app.UseAuthorization();
app.MapControllers();

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
