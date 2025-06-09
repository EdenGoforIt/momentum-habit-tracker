using System.Reflection;
using Microsoft.AspNetCore.JsonPatch;
using Newtonsoft.Json;

namespace Momentum.Api.Wrappers;

internal sealed class JsonPatchDocumentWrapper<T>(JsonPatchDocument<T>? value)
    where T : class
{

    public JsonPatchDocument<T>? Value { get; } = value;

    public async static ValueTask<JsonPatchDocumentWrapper<T>?> BindAsync(HttpContext context, ParameterInfo parameter)
    {
        Guard.Against.Null(context, nameof(context));

        if (!context.Request.HasJsonContentType())
        {
            throw new BadHttpRequestException(
                "Request content type was not a recognized JSON content type.",
                StatusCodes.Status415UnsupportedMediaType);
        }

        using var reader = new StreamReader(context.Request.Body);
        string requestBody = await reader.ReadToEndAsync().ConfigureAwait(false);

        return new JsonPatchDocumentWrapper<T>(JsonConvert.DeserializeObject<JsonPatchDocument<T>>(requestBody));
    }
}
