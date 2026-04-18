using System.Threading.RateLimiting;
using Customers.Middleware;
using Customers.Repositories;
using Customers.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using Serilog.Formatting.Compact;
using System.Text;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console(new CompactJsonFormatter())
    .CreateBootstrapLogger();

try
{
    Log.Information("Starting Customers service");

    var builder = WebApplication.CreateBuilder(args);

    builder.Host.UseSerilog((ctx, services, cfg) =>
        cfg.ReadFrom.Configuration(ctx.Configuration)
           .ReadFrom.Services(services)
           .Enrich.FromLogContext()
           .Enrich.WithProperty("Service", "Customers")
           .WriteTo.Console(new CompactJsonFormatter()));

    var corsOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
                      ?? throw new InvalidOperationException("Cors:AllowedOrigins configuration is required");

    builder.Services.AddCors(options =>
        options.AddDefaultPolicy(policy =>
            policy.WithOrigins(corsOrigins)
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials()));

    builder.Services.AddRateLimiter(options =>
    {
        options.AddFixedWindowLimiter("fixed", cfg =>
        {
            cfg.PermitLimit = 60;
            cfg.Window = TimeSpan.FromMinutes(1);
            cfg.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
            cfg.QueueLimit = 0;
        });
        options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    });

    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            var jwtConfig = builder.Configuration.GetSection("Jwt");
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtConfig["Issuer"],
                ValidAudience = jwtConfig["Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(
                        jwtConfig["Secret"] ?? throw new InvalidOperationException("Jwt:Secret configuration is required")
                    )
                )
            };
        });

    builder.Services.AddAuthorization();

    var dataApiBaseUrl = builder.Configuration["DataAPI:BaseUrl"]
                         ?? throw new InvalidOperationException("DataAPI:BaseUrl configuration is required");

    builder.Services.AddHttpClient("DataAPI", client =>
    {
        client.BaseAddress = new Uri(dataApiBaseUrl);
        client.DefaultRequestHeaders.Add("Accept", "application/json");
    });

    builder.Services.AddScoped<ICustomersRepository, CustomersRepository>();
    builder.Services.AddScoped<ICustomersService, CustomersService>();

    builder.Services.AddControllers();
    builder.Services.AddEndpointsApiExplorer();

    var app = builder.Build();

    app.Use(async (context, next) =>
    {
        context.Response.Headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains";
        context.Response.Headers["X-Content-Type-Options"] = "nosniff";
        context.Response.Headers["X-Frame-Options"] = "DENY";
        context.Response.Headers["Content-Security-Policy"] = "default-src 'self'";
        context.Response.Headers["Referrer-Policy"] = "no-referrer";
        await next();
    });

    app.UseMiddleware<CorrelationIdMiddleware>();
    app.UseCors();
    app.UseRateLimiter();
    app.UseAuthentication();
    app.UseAuthorization();

    app.MapGet("/health", () => Results.Ok(new { status = "healthy", service = "Customers" }))
       .AllowAnonymous()
       .WithMetadata(new DisableRateLimitingAttribute());

    app.MapControllers();

    app.Run();
}
catch (Exception ex) when (ex is not HostAbortedException)
{
    Log.Fatal(ex, "Customers service terminated unexpectedly");
    throw;
}
finally
{
    Log.CloseAndFlush();
}
