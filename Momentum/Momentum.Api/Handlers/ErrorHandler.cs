using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Momentum.Api.Abstractions;
using Momentum.Domain.Errors;
using Momentum.Api.Extensions;

namespace Momentum.Api.Handlers;

// ReSharper disable once HollowTypeName
internal sealed class ErrorHandler : IErrorHandler
{
    private readonly ILogger _logger;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ProblemDetailsFactory _problemDetailsFactory;
    private readonly Dictionary<ErrorType, Func<string?, IEnumerable<string>?, ObjectResult>> _errorHandlers;

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
            { ErrorType.Conflict, ConflictResponse },
            { ErrorType.NotFound, NotFoundResponse },
            { ErrorType.BadRequest, BadRequestResponse },
            { ErrorType.Validation, ValidationResponse },
            { ErrorType.Unexpected, UnexpectedResponse }
        };
    }

    public ObjectResult HandleError(IDomainError error)
    {
        if (_errorHandlers.TryGetValue(error.ErrorType, out Func<string?, IEnumerable<string>?, ObjectResult>? handler))
        {
            return handler(error.ErrorMessage, error.Errors);
        }

        throw new InvalidOperationException($"Unsupported error type: {error.ErrorType}");
    }

    public ObjectResult NotFoundResponse(string? message = null, IEnumerable<string>? errors = null) =>
        new NotFoundObjectResult(
            _problemDetailsFactory.CreateNotFound(_httpContextAccessor.HttpContext!, message, errors));

    public ObjectResult BadRequestResponse(string? details = null, IEnumerable<string>? errors = null) =>
        new BadRequestObjectResult(
            _problemDetailsFactory.CreateBadRequest(_httpContextAccessor.HttpContext!, details, errors));

    public ObjectResult ConflictResponse(string? details = null, IEnumerable<string>? errors = null) =>
        new ObjectResult(_problemDetailsFactory.CreateConflict(_httpContextAccessor.HttpContext!, details, errors))
            { StatusCode = StatusCodes.Status409Conflict };

    public ObjectResult ValidationResponse(string? details = null, IEnumerable<string>? errors = null) =>
        new BadRequestObjectResult(
            _problemDetailsFactory.CreateValidation(_httpContextAccessor.HttpContext!, details, errors));

    public ObjectResult UnexpectedResponse(string? details = null, IEnumerable<string>? errors = null) =>
        new ObjectResult(
                _problemDetailsFactory.CreateUnexpectedResponse(_httpContextAccessor.HttpContext!, details, errors))
            { StatusCode = StatusCodes.Status500InternalServerError };
}
