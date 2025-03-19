using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Momentum.Api.Abstractions;
using Momentum.Api.Extensions;
using Momentum.Domain.Errors;

namespace Momentum.Api.Handlers;

// ReSharper disable once HollowTypeName
[SuppressMessage("Performance", "CA1812:Avoid uninstantiated internal classes",
    Justification = "Instantiated via Dependency Injection")]
internal sealed class ErrorHandler : IErrorHandler
{
    private readonly Dictionary<ErrorType, Func<string?, IEnumerable<string>?, ObjectResult>> _errorHandlers;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger _logger;
    private readonly ProblemDetailsFactory _problemDetailsFactory;

    public ErrorHandler(
        ILogger<ErrorHandler> logger,
        IHttpContextAccessor httpContextAccessor,
        ProblemDetailsFactory problemDetailsFactory)
    {
        _logger = logger;
        _httpContextAccessor = httpContextAccessor;
        _problemDetailsFactory = problemDetailsFactory;
        _errorHandlers = new Dictionary<ErrorType, Func<string?, IEnumerable<string>?, ObjectResult>>
        {
            {
                ErrorType.Conflict, ConflictResponse
            },
            {
                ErrorType.NotFound, NotFoundResponse
            },
            {
                ErrorType.BadRequest, BadRequestResponse
            },
            {
                ErrorType.Validation, ValidationResponse
            },
            {
                ErrorType.Unexpected, UnexpectedResponse
            }
        };
    }

    public IResult HandleError(IDomainError error)
    {
        ObjectResult objectResult = CreateObjectResult(error);

        return ConvertObjectResultToIResult(objectResult);
    }

    public ObjectResult NotFoundResponse(string? message = null, IEnumerable<string>? errors = null) =>
        new NotFoundObjectResult(
            _problemDetailsFactory.CreateNotFound(_httpContextAccessor.HttpContext!, message, errors));

    public ObjectResult BadRequestResponse(string? details = null, IEnumerable<string>? errors = null) =>
        new BadRequestObjectResult(
            _problemDetailsFactory.CreateBadRequest(_httpContextAccessor.HttpContext!, details, errors));

    public ObjectResult ConflictResponse(string? details = null, IEnumerable<string>? errors = null) =>
        new(_problemDetailsFactory.CreateConflict(_httpContextAccessor.HttpContext!, details, errors))
        {
            StatusCode = StatusCodes.Status409Conflict
        };

    public ObjectResult ValidationResponse(string? details = null, IEnumerable<string>? errors = null) =>
        new BadRequestObjectResult(
            _problemDetailsFactory.CreateValidation(_httpContextAccessor.HttpContext!, details, errors));

    public ObjectResult UnexpectedResponse(string? details = null, IEnumerable<string>? errors = null) =>
        new(
            _problemDetailsFactory.CreateUnexpectedResponse(_httpContextAccessor.HttpContext!, details, errors))
        {
            StatusCode = StatusCodes.Status500InternalServerError
        };

    private ObjectResult CreateObjectResult(IDomainError error)
    {
        if (_errorHandlers.TryGetValue(error.ErrorType, out Func<string?, IEnumerable<string>?, ObjectResult>? handler))
        {
            return handler(error.ErrorMessage, error.Errors);
        }

        throw new InvalidOperationException($"Unsupported error type: {error.ErrorType}");
    }

    private static IResult ConvertObjectResultToIResult(ObjectResult objectResult) =>
        objectResult.StatusCode switch
        {
            400 => Results.BadRequest(objectResult.Value),
            404 => Results.NotFound(objectResult.Value),
            403 => Results.Forbid(),
            500 => Results.Problem(detail: objectResult.Value?.ToString()),
            _ => Results.StatusCode(objectResult.StatusCode ?? 500)
        };
}
