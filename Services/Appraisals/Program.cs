using Appraisals.Middleware;
using Appraisals.Repositories;
using Appraisals.Services;
using Serilog;
using Serilog.Events;

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
    .Enrich.FromLogContext()
    .WriteTo.Console(new Serilog.Formatting.Json.JsonFormatter())
    .CreateBootstrapLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    builder.Host.UseSerilog((context, services, configuration) =>
        configuration
            .ReadFrom.Configuration(context.Configuration)
            .ReadFrom.Services(services)
            .Enrich.FromLogContext()
            .WriteTo.Console(new Serilog.Formatting.Json.JsonFormatter()));

    builder.Services.AddControllers();

    var dataApiBaseUrl = builder.Configuration["DataApi:BaseUrl"]
        ?? throw new InvalidOperationException("DataApi:BaseUrl is not configured.");

    builder.Services.AddHttpClient<IAppraisalRepository, AppraisalRepository>(client =>
    {
        client.BaseAddress = new Uri(dataApiBaseUrl.TrimEnd('/') + "/");
        client.DefaultRequestHeaders.Add("Accept", "application/json");
    });

    builder.Services.AddScoped<IAppraisalService, AppraisalService>();

    var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
        ?? ["http://localhost:3000"];

    builder.Services.AddCors(options =>
    {
        options.AddDefaultPolicy(policy =>
            policy.WithOrigins(allowedOrigins)
                  .AllowAnyHeader()
                  .AllowAnyMethod());
    });

    var app = builder.Build();

    app.UseSerilogRequestLogging();
    app.UseMiddleware<CorrelationIdMiddleware>();
    app.UseMiddleware<GlobalExceptionMiddleware>();

    app.UseCors();
    app.UseHttpsRedirection();
    app.MapControllers();

    app.MapGet("/health", () => Results.Ok(new { status = "healthy", service = "appraisals" }));

    Log.Information("Appraisals service starting");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Appraisals service failed to start");
    throw;
}
finally
{
    Log.CloseAndFlush();
}
