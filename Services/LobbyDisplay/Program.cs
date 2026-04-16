using LobbyDisplay.Middleware;
using LobbyDisplay.Repositories;
using LobbyDisplay.Services;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Serilog structured JSON logging
builder.Host.UseSerilog((context, configuration) =>
    configuration.ReadFrom.Configuration(context.Configuration));

// DataAPI HTTP client — no direct DB access
var dataApiBaseUrl = builder.Configuration["DataApi:BaseUrl"]
    ?? throw new InvalidOperationException("DataApi:BaseUrl is required in configuration.");

builder.Services.AddHttpClient<IDisplayRepository, DisplayRepository>(client =>
{
    client.BaseAddress = new Uri(dataApiBaseUrl);
});

// Service layer DI
builder.Services.AddScoped<IDisplayService, DisplayService>();

// Controllers
builder.Services.AddControllers();

// Health check
builder.Services.AddHealthChecks();

// CORS — origins from config only; wildcard is forbidden in non-local environments
var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() ?? [];

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        if (allowedOrigins.Length > 0)
        {
            policy.WithOrigins(allowedOrigins)
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        }
    });
});

var app = builder.Build();

// Security headers on every response
app.Use(async (context, next) =>
{
    context.Response.Headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains";
    context.Response.Headers["X-Content-Type-Options"] = "nosniff";
    context.Response.Headers["X-Frame-Options"] = "DENY";
    context.Response.Headers["Referrer-Policy"] = "no-referrer";
    context.Response.Headers["Content-Security-Policy"] = "default-src 'self'";
    await next();
});

// CorrelationId must be first so all downstream logs carry the ID
app.UseMiddleware<CorrelationIdMiddleware>();

app.UseSerilogRequestLogging();

app.UseCors();

app.UseAuthorization();

// Health check
app.MapHealthChecks("/health");

app.MapControllers();

app.Run();

// Expose for integration test factory
public partial class Program { }
