using Microsoft.AspNetCore.Mvc;

namespace Momentum.Api.Controllers;

[ApiController]
[Route("[controller]")]
internal sealed class WeatherForecast() : ControllerBase
{
    [HttpGet(Name = "GetWeatherForecast")]
    public static WeatherForecastDto[] Get() =>
        Enumerable.Range(1, 5).Select(index => new WeatherForecastDto
            {
                Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                TemperatureC = 3,
                Summary = "test"
            })
            .ToArray();
}
