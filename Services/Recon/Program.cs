using DealerArsenal.Recon.Middleware;
using DealerArsenal.Recon.Models;
using DealerArsenal.Recon.Repositories;
using DealerArsenal.Recon.Services;
using Microsoft.AspNetCore.Diagnostics;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog((context, configuration) =>
    configuration.ReadFrom.Configuration(context.Configuration));

builder.Services.AddControllers();

var allowedOrigins = builder.Configuration
    .GetValue<string>("Cors:AllowedOrigins", "http://localhost:3000")!
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var dataApiBaseUrl = builder.Configuration.GetValue<string>("DataApi:BaseUrl")
    ?? throw new InvalidOperationException("DataApi:BaseUrl is required.");

builder.Services.AddHttpClient("DataApi", client =>
{
    client.BaseAddress = new Uri(dataApiBaseUrl);
    client.DefaultRequestHeaders.Add("Accept", "application/json");
});

builder.Services.AddScoped<IReconRepository, ReconRepository>();
builder.Services.AddScoped<IReconService, ReconService>();

builder.Services.AddExceptionHandler<DomainExceptionHandler>();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

var app = builder.Build();

app.UseMiddleware<CorrelationIdMiddleware>();

app.UseSerilogRequestLogging();

app.UseCors();

app.UseExceptionHandler();

app.MapControllers();

app.Run();

public partial class Program { }
