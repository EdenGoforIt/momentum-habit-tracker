using Microsoft.AspNetCore.Mvc;
using Momentum.Domain.Errors;

namespace Momentum.Api.Abstractions;

internal interface IErrorHandler
{
    /// <summary>
    /// Handles domain errors by mapping them to appropriate HTTP responses.
    /// </summary>
    /// <param name="error">The domain error to handle.</param>
    /// <returns>An appropriate ObjectResult based on the error type.</returns>
    ObjectResult HandleError(IDomainError error);

    /// <summary>
    /// Creates a NotFound (404) response with optional message and errors.
    /// </summary>
    /// <param name="message">Optional error message.</param>
    /// <param name="errors">Optional collection of detailed error messages.</param>
    /// <returns>A NotFound ObjectResult.</returns>
    ObjectResult NotFoundResponse(string? message = null, IEnumerable<string>? errors = null);

    /// <summary>
    /// Creates a BadRequest (400) response with optional details and errors.
    /// </summary>
    /// <param name="details">Optional error details.</param>
    /// <param name="errors">Optional collection of detailed error messages.</param>
    /// <returns>A BadRequest ObjectResult.</returns>
    ObjectResult BadRequestResponse(string? details = null, IEnumerable<string>? errors = null);

    /// <summary>
    /// Creates a Conflict (409) response with optional details and errors.
    /// </summary>
    /// <param name="details">Optional error details.</param>
    /// <param name="errors">Optional collection of detailed error messages.</param>
    /// <returns>A Conflict ObjectResult.</returns>
    ObjectResult ConflictResponse(string? details = null, IEnumerable<string>? errors = null);

    /// <summary>
    /// Creates a validation error response (400) with optional details and errors.
    /// </summary>
    /// <param name="details">Optional error details.</param>
    /// <param name="errors">Optional collection of detailed error messages.</param>
    /// <returns>A BadRequest ObjectResult with validation problem details.</returns>
    ObjectResult ValidationResponse(string? details = null, IEnumerable<string>? errors = null);

    /// <summary>
    /// Creates an unexpected error response (500) with optional details and errors.
    /// </summary>
    /// <param name="details">Optional error details.</param>
    /// <param name="errors">Optional collection of detailed error messages.</param>
    /// <returns>A 500 Internal Server Error ObjectResult with unexpected error problem details.</returns>
    ObjectResult UnexpectedResponse(string? details = null, IEnumerable<string>? errors = null);
}
