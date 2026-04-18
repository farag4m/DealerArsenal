using DealerArsenal.Operations.Models;
using Microsoft.AspNetCore.Diagnostics;

namespace DealerArsenal.Operations.Infrastructure;

/// <summary>
/// Catches all unhandled exceptions, logs them with correlation ID,
/// and returns a sanitised error response per SECURITY_RULES.md
/// (no stack traces, no internal details exposed to callers).
/// </summary>
public sealed class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        var correlationId = httpContext.Items["CorrelationId"]?.ToString() ?? string.Empty;

        _logger.LogError(
            exception,
            "Unhandled exception. CorrelationId={CorrelationId} Path={Path} Method={Method}",
            correlationId,
            httpContext.Request.Path,
            httpContext.Request.Method);

        var (statusCode, message) = exception switch
        {
            DomainException => (StatusCodes.Status400BadRequest, exception.Message),
            UnauthorizedAccessException => (StatusCodes.Status401Unauthorized, "Unauthorized"),
            KeyNotFoundException => (StatusCodes.Status404NotFound, "Resource not found"),
            _ => (StatusCodes.Status500InternalServerError, "An unexpected error occurred"),
        };

        httpContext.Response.StatusCode = statusCode;
        httpContext.Response.ContentType = "application/json";

        var response = ApiResponse<object>.Fail(message);
        await httpContext.Response.WriteAsJsonAsync(response, cancellationToken);

        return true;
    }
}
