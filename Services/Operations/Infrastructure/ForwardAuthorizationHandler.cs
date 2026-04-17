using System.Net.Http.Headers;

namespace DealerArsenal.Operations.Infrastructure;

/// <summary>
/// DelegatingHandler that forwards the caller's JWT to the DataAPI so
/// it can apply its own auth checks. Reads the Authorization header from
/// the active HTTP context on each outgoing DataAPI request.
/// </summary>
public sealed class ForwardAuthorizationHandler : DelegatingHandler
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public ForwardAuthorizationHandler(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    protected override Task<HttpResponseMessage> SendAsync(
        HttpRequestMessage request,
        CancellationToken cancellationToken)
    {
        var authHeader = _httpContextAccessor.HttpContext?
            .Request.Headers.Authorization
            .FirstOrDefault();

        if (!string.IsNullOrWhiteSpace(authHeader) &&
            AuthenticationHeaderValue.TryParse(authHeader, out var parsed))
        {
            request.Headers.Authorization = parsed;
        }

        return base.SendAsync(request, cancellationToken);
    }
}
