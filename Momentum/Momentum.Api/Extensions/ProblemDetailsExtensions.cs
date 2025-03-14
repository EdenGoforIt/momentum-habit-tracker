using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;

namespace Momentum.Api.Extensions;

internal static class ProblemDetailsExtensions
{
    public static ProblemDetails CreateNotFound(
        this ProblemDetailsFactory detailsFactory,
        HttpContext context,
        string? details = null,
        IEnumerable<string>? errors = null) =>
        CreateProblemDetailsWith(detailsFactory, StatusCodes.Status404NotFound, context, details, errors);

    public static ProblemDetails CreateBadRequest(
        this ProblemDetailsFactory detailsFactory,
        HttpContext context,
        string? details = null,
        IEnumerable<string>? errors = null) => CreateProblemDetailsWith(detailsFactory, StatusCodes.Status400BadRequest,
        context, details, errors);

    public static ProblemDetails CreateConflict(
        this ProblemDetailsFactory detailsFactory,
        HttpContext context,
        string? details = null,
        IEnumerable<string>? errors = null) =>
        CreateProblemDetailsWith(detailsFactory, StatusCodes.Status409Conflict, context, details, errors);

    public static ProblemDetails CreateValidation(
        this ProblemDetailsFactory detailsFactory,
        HttpContext context,
        string? details = null,
        IEnumerable<string>? errors = null) => CreateProblemDetailsWith(detailsFactory, StatusCodes.Status400BadRequest,
        context, details, errors);

    public static ProblemDetails CreateUnexpectedResponse(
        this ProblemDetailsFactory detailsFactory,
        HttpContext context,
        string? details = null,
        IEnumerable<string>? errors = null) => CreateProblemDetailsWith(detailsFactory,
        StatusCodes.Status500InternalServerError, context, details, errors);


    private static ProblemDetails CreateProblemDetailsWith(ProblemDetailsFactory detailsFactory, int statusCode,
        HttpContext context,
        string? message = null,
        IEnumerable<string>? errors = null)
    {
        if (errors?.Any() == true)
        {
            var errorList = new StringBuilder();
            errorList.AppendJoin(",", errors);

            return detailsFactory.CreateProblemDetails(context, statusCode, detail: errorList.ToString());
        }

        return detailsFactory.CreateProblemDetails(context, statusCode, detail: message);
    }
}
