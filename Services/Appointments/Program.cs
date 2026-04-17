using System.Threading.RateLimiting;
using DealerArsenal.Appointments.Middleware;
using DealerArsenal.Appointments.Repositories;
using DealerArsenal.Appointments.Services;
using Microsoft.AspNetCore.RateLimiting;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Serilog structured JSON logging
builder.Host.UseSerilog((ctx, lc) =>
    lc.ReadFrom.Configuration(ctx.Configuration));

// Port from config — not hardcoded
var port = builder.Configuration.GetValue<int>("AppSettings:Port", 5030);
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

// CORS — origins from config
var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// DataAPI HTTP client
var dataApiBaseUrl = builder.Configuration.GetValue<string>("AppSettings:DataApiBaseUrl")
    ?? throw new InvalidOperationException("AppSettings:DataApiBaseUrl must be configured");

builder.Services.AddHttpClient<IAppointmentRepository, AppointmentRepository>(client =>
{
    client.BaseAddress = new Uri(dataApiBaseUrl);
    client.DefaultRequestHeaders.Add("Accept", "application/json");
});

// DI
builder.Services.AddScoped<IAppointmentService, AppointmentService>();

builder.Services.AddControllers();

// Rate limiting — 60 req/min per fixed window
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddFixedWindowLimiter("api", o =>
    {
        o.PermitLimit = 60;
        o.Window = TimeSpan.FromMinutes(1);
        o.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        o.QueueLimit = 0;
    });
});

var app = builder.Build();

// Security headers
app.Use(async (context, next) =>
{
    context.Response.Headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains";
    context.Response.Headers["X-Content-Type-Options"] = "nosniff";
    context.Response.Headers["X-Frame-Options"] = "DENY";
    context.Response.Headers["Content-Security-Policy"] = "default-src 'self'";
    context.Response.Headers["Referrer-Policy"] = "no-referrer";
    await next();
});

// Middleware pipeline
app.UseMiddleware<CorrelationIdMiddleware>();
app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseCors();
app.UseRateLimiter();
app.MapControllers().RequireRateLimiting("api");

// Health check endpoint
app.MapGet("/health", () => Results.Ok(new { status = "healthy", service = "appointments" }));

app.Run();

// Expose Program for integration tests
public partial class Program { }
