using System.Net;
using System.Text.Json;
using Appraisals.Models;
using Appraisals.Services;
using Microsoft.Extensions.Logging;

namespace Appraisals.Middleware;

public sealed class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (AppraisalNotFoundException ex)
        {
            _logger.LogWarning(
                "Appraisal not found appraisalId={AppraisalId}",
                ex.AppraisalId);

            await WriteErrorResponse(context, HttpStatusCode.NotFound, "The requested appraisal was not found.");
        }
        catch (AppraisalDomainException ex)
        {
            _logger.LogWarning(
                "Domain rule violation reason={Reason}",
                ex.Message);

            await WriteErrorResponse(context, HttpStatusCode.UnprocessableEntity, ex.Message);
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "DataAPI request failed statusCode={StatusCode}", ex.StatusCode);

            await WriteErrorResponse(context, HttpStatusCode.BadGateway, "Upstream data service error.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception");

            await WriteErrorResponse(context, HttpStatusCode.InternalServerError, "An unexpected error occurred.");
        }
    }

    private static async Task WriteErrorResponse(
        HttpContext context,
        HttpStatusCode statusCode,
        string error)
    {
        context.Response.StatusCode = (int)statusCode;
        context.Response.ContentType = "application/json";

        var response = ApiResponse<object>.Fail(error);
        var json = JsonSerializer.Serialize(response, JsonOptions);

        await context.Response.WriteAsync(json);
    }
}
