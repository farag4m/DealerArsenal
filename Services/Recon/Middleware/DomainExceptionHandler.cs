using DealerArsenal.Recon.Models;
using Microsoft.AspNetCore.Diagnostics;

namespace DealerArsenal.Recon.Middleware;

public sealed class DomainExceptionHandler : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        if (exception is not DomainException domainEx)
            return false;

        httpContext.Response.StatusCode = StatusCodes.Status422UnprocessableEntity;
        httpContext.Response.ContentType = "application/json";

        var response = ApiResponse<object>.Fail(domainEx.Message);
        await httpContext.Response.WriteAsJsonAsync(response, cancellationToken);
        return true;
    }
}
