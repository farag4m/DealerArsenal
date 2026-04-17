using System.Text;
using System.Threading.RateLimiting;
using DealerArsenal.Operations.Infrastructure;
using DealerArsenal.Operations.Middleware;
using DealerArsenal.Operations.Repositories;
using DealerArsenal.Operations.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.IdentityModel.Tokens;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Serilog structured JSON logging — config driven from appsettings
builder.Host.UseSerilog((context, configuration) =>
    configuration.ReadFrom.Configuration(context.Configuration));

// DataAPI HTTP client — no direct DB access per GLOBAL_RULES.md
var dataApiBaseUrl = builder.Configuration["DataApi:BaseUrl"]
    ?? throw new InvalidOperationException("DataApi:BaseUrl is required in configuration.");

builder.Services.AddHttpContextAccessor();
builder.Services.AddTransient<ForwardAuthorizationHandler>();

builder.Services.AddHttpClient("DataApi", client =>
{
    client.BaseAddress = new Uri(dataApiBaseUrl);
    client.DefaultRequestHeaders.Add("Accept", "application/json");
})
.AddHttpMessageHandler<ForwardAuthorizationHandler>();

// JWT auth — validates signature, expiry, issuer per SECURITY_RULES.md
var jwtSection = builder.Configuration.GetSection("Jwt");
var signingKey = jwtSection["SigningKey"]
    ?? throw new InvalidOperationException("Jwt:SigningKey is required in configuration.");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opts =>
    {
        opts.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSection["Issuer"],
            ValidAudience = jwtSection["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(signingKey)),
            ClockSkew = TimeSpan.Zero,
        };
    });

// Role-based policy — OWNER and GM only for manager views
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("ManagerOnly", policy =>
        policy.RequireClaim("role", "OWNER", "GM"));
});

// Service layer DI
builder.Services.AddScoped<IOperationsRepository, OperationsRepository>();
builder.Services.AddScoped<IOperationsService, OperationsService>();

// Global exception handler — catches all unhandled exceptions, returns sanitised JSON
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

// Controllers with enum-as-string serialisation
builder.Services.AddControllers()
    .AddJsonOptions(opts =>
        opts.JsonSerializerOptions.Converters.Add(
            new System.Text.Json.Serialization.JsonStringEnumConverter()));

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
                  .AllowAnyMethod()
                  .AllowCredentials();
        }
    });
});

// Fixed-window rate limiter: 60 requests per minute — same policy as ControlCenter.Web
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    options.AddFixedWindowLimiter("api", limiterOptions =>
    {
        limiterOptions.PermitLimit = 60;
        limiterOptions.Window = TimeSpan.FromMinutes(1);
        limiterOptions.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        limiterOptions.QueueLimit = 0;
    });
});

var app = builder.Build();

app.UseExceptionHandler();

// All 5 mandatory security headers on every response per SECURITY_RULES.md
app.Use(async (context, next) =>
{
    context.Response.Headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains";
    context.Response.Headers["X-Content-Type-Options"] = "nosniff";
    context.Response.Headers["X-Frame-Options"] = "DENY";
    context.Response.Headers["Referrer-Policy"] = "no-referrer";
    context.Response.Headers["Content-Security-Policy"] = "default-src 'none';";
    await next();
});

// CorrelationId must be first so all downstream logs carry the ID
app.UseMiddleware<CorrelationIdMiddleware>();

app.UseSerilogRequestLogging();

if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
    app.UseHttpsRedirection();
}

app.UseCors();

app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();

// Health check — excluded from rate limiting (infra probe, not a public API call)
app.MapHealthChecks("/health");

app.MapControllers()
   .RequireRateLimiting("api");

app.Run();

// Expose for integration test factory
public partial class Program { }
