namespace ControlCenter.Web.Middleware;

/// <summary>
/// Adds mandatory HTTP security headers to every response per SECURITY_RULES.md.
/// Applied via middleware so headers are set globally — not per-route.
/// </summary>
public sealed class SecurityHeadersMiddleware
{
    private readonly RequestDelegate _next;

    public SecurityHeadersMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        context.Response.OnStarting(() =>
        {
            var headers = context.Response.Headers;

            // HSTS — 2 years, include subdomains
            headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains";

            // Prevent MIME-type sniffing
            headers["X-Content-Type-Options"] = "nosniff";

            // Deny framing — prevents clickjacking
            headers["X-Frame-Options"] = "DENY";

            // Minimal CSP for the launcher SPA:
            // - default-src 'self': only same-origin resources
            // - style-src 'self' 'unsafe-inline' fonts.googleapis.com: Tailwind + Google Fonts
            // - font-src 'self' fonts.gstatic.com: Google Fonts glyphs
            // - img-src 'self' data:: inline SVG / base64 assets
            // - object-src 'none': block plugins
            // - base-uri 'self': prevent base tag injection
            headers["Content-Security-Policy"] =
                "default-src 'self'; " +
                "script-src 'self'; " +
                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
                "font-src 'self' https://fonts.gstatic.com; " +
                "img-src 'self' data:; " +
                "connect-src 'self'; " +
                "object-src 'none'; " +
                "base-uri 'self'; " +
                "form-action 'self';";

            // No referrer sent outside origin
            headers["Referrer-Policy"] = "no-referrer";

            return Task.CompletedTask;
        });

        await _next(context);
    }
}

public static class SecurityHeadersMiddlewareExtensions
{
    public static IApplicationBuilder UseSecurityHeaders(this IApplicationBuilder app)
        => app.UseMiddleware<SecurityHeadersMiddleware>();
}
