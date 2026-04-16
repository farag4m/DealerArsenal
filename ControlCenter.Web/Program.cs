using System.Threading.RateLimiting;
using ControlCenter.Web.Middleware;
using Microsoft.AspNetCore.RateLimiting;
using Serilog;
using Serilog.Events;
using Serilog.Formatting.Compact;

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
    .MinimumLevel.Override("Microsoft.Hosting.Lifetime", LogEventLevel.Information)
    .Enrich.FromLogContext()
    .Enrich.WithCorrelationId()
    .WriteTo.Console(new CompactJsonFormatter())
    .WriteTo.File(
        formatter: new CompactJsonFormatter(),
        path: "logs/controlcenter-.log",
        rollingInterval: RollingInterval.Day,
        retainedFileCountLimit: 30)
    .CreateLogger();

try
{
    Log.Information("Starting ControlCenter.Web");

    var builder = WebApplication.CreateBuilder(args);

    builder.Host.UseSerilog();

    builder.Services.AddControllers();

    builder.Services.AddHttpContextAccessor();

    builder.Services.AddCors(options =>
    {
        var allowedOrigins = builder.Configuration
            .GetSection("Cors:AllowedOrigins")
            .Get<string[]>() ?? [];

        options.AddDefaultPolicy(policy =>
            policy.WithOrigins(allowedOrigins)
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials());
    });

    // Rate limiting — applied to all API endpoints per SECURITY_RULES.md
    builder.Services.AddRateLimiter(options =>
    {
        options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

        // Fixed-window policy: 60 requests per minute per IP
        options.AddFixedWindowLimiter("api", limiterOptions =>
        {
            limiterOptions.PermitLimit = 60;
            limiterOptions.Window = TimeSpan.FromMinutes(1);
            limiterOptions.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
            limiterOptions.QueueLimit = 0;
        });
    });

    var app = builder.Build();

    // Security headers on every response — must come first
    app.UseSecurityHeaders();

    app.UseCorrelationId();

    app.UseSerilogRequestLogging(opts =>
    {
        opts.EnrichDiagnosticContext = (diagnosticContext, httpContext) =>
        {
            diagnosticContext.Set("RequestHost", httpContext.Request.Host.Value ?? string.Empty);
            diagnosticContext.Set("RequestScheme", httpContext.Request.Scheme);
            diagnosticContext.Set("CorrelationId", httpContext.Items["CorrelationId"] ?? string.Empty);
        };
    });

    if (!app.Environment.IsDevelopment())
    {
        app.UseHsts();
        app.UseHttpsRedirection();
    }

    app.UseCors();

    app.UseRateLimiter();

    app.UseStaticFiles();
    app.UseRouting();
    app.UseAuthorization();

    app.MapControllers()
       .RequireRateLimiting("api");

    // Serve SPA — must come last
    app.MapFallbackToFile("index.html");

    Log.Information("ControlCenter.Web started successfully");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "ControlCenter.Web terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}
