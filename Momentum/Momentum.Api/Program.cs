using System.Reflection;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Momentum.Api.Extensions;
using Momentum.Application.Extensions;
using Momentum.Infrastructure.Data;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);
// builder.Services.AddAuthentication(x =>
// {
//     x.defaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
//     x.defaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
//     x.defaultscheme = JwtBearerDefaults.AuthenticationScheme;
// }).AddJwtBearer(x =>
// {
//     x.RequireHttpsMetadata = false;
//     x.SaveToken = true;
//     x.TokenValidationParameters = new TokenValidationParameters
//     {
//         ValidateIssuerSigningKey = true,
//         IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(builder.Configuration["Jwt:Key"])),
//         ValidateIssuer = false,
//         ValidateAudience = false
//     };
// });

builder.Services.AddApplicationLayer();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSwaggerGen(options =>
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "Momentum API", Version = "v1" }));
builder.Services.AddServices();
builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<IdentityUser>()
    .AddEntityFrameworkStores<DataContext>();

WebApplication app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options => options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1"));
}

app.MapIdentityApi<IdentityUser>();
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
