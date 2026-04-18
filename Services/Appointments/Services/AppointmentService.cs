using DealerArsenal.Appointments.Models;
using DealerArsenal.Appointments.Repositories;
using Microsoft.Extensions.Logging;

namespace DealerArsenal.Appointments.Services;

public sealed class AppointmentService : IAppointmentService
{
    private static readonly AppointmentStatus[] ValidTransitions = [];

    private readonly IAppointmentRepository _repository;
    private readonly ILogger<AppointmentService> _logger;

    public AppointmentService(IAppointmentRepository repository, ILogger<AppointmentService> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public async Task<IReadOnlyList<Appointment>> GetAllAsync(AppointmentListFilter filter, CancellationToken ct = default)
    {
        _logger.LogInformation("Fetching appointments list with filter {@Filter}", filter);
        var results = await _repository.GetAllAsync(filter, ct);
        _logger.LogInformation("Fetched {Count} appointments", results.Count);
        return results;
    }

    public async Task<Appointment> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        _logger.LogInformation("Fetching appointment {AppointmentId}", id);
        var appointment = await _repository.GetByIdAsync(id, ct);

        if (appointment is null)
        {
            _logger.LogWarning("Appointment {AppointmentId} not found", id);
            throw new DomainException($"Appointment {id} not found");
        }

        return appointment;
    }

    public async Task<Appointment> CreateAsync(CreateAppointmentRequest request, CancellationToken ct = default)
    {
        _logger.LogInformation("Creating appointment for customer {CustomerName} at {ScheduledAt}",
            request.CustomerName, request.ScheduledAt);

        if (request.ScheduledAt <= DateTime.UtcNow)
            throw new DomainException("Appointment must be scheduled in the future");

        var created = await _repository.CreateAsync(request, ct);
        _logger.LogInformation("Created appointment {AppointmentId}", created.Id);
        return created;
    }

    public async Task<Appointment> UpdateStatusAsync(Guid id, UpdateAppointmentStatusRequest request, CancellationToken ct = default)
    {
        _logger.LogInformation("Updating appointment {AppointmentId} status to {Status}", id, request.Status);

        var existing = await _repository.GetByIdAsync(id, ct);
        if (existing is null)
            throw new DomainException($"Appointment {id} not found");

        ValidateStatusTransition(existing.Status, request.Status);

        var updated = await _repository.UpdateStatusAsync(id, request.Status, ct);
        _logger.LogInformation("Updated appointment {AppointmentId} to status {Status}", id, request.Status);
        return updated;
    }

    public async Task<VehicleReadiness> GetVehicleReadinessAsync(Guid id, CancellationToken ct = default)
    {
        _logger.LogInformation("Fetching vehicle readiness for appointment {AppointmentId}", id);

        var appointment = await _repository.GetByIdAsync(id, ct);
        if (appointment is null)
            throw new DomainException($"Appointment {id} not found");

        return await _repository.GetVehicleReadinessAsync(id, ct);
    }

    public async Task<FollowUpTask> CreateFollowUpAsync(Guid id, CreateFollowUpRequest request, CancellationToken ct = default)
    {
        _logger.LogInformation("Creating follow-up for appointment {AppointmentId} at {ScheduledAt}",
            id, request.ScheduledAt);

        var appointment = await _repository.GetByIdAsync(id, ct);
        if (appointment is null)
            throw new DomainException($"Appointment {id} not found");

        if (request.ScheduledAt <= DateTime.UtcNow)
            throw new DomainException("Follow-up must be scheduled in the future");

        var followUp = await _repository.CreateFollowUpAsync(id, request, ct);
        _logger.LogInformation("Created follow-up for appointment {AppointmentId}", id);
        return followUp;
    }

    private static void ValidateStatusTransition(AppointmentStatus current, AppointmentStatus next)
    {
        var allowed = current switch
        {
            AppointmentStatus.Scheduled => new[] { AppointmentStatus.Confirmed },
            AppointmentStatus.Confirmed => new[] { AppointmentStatus.Arrived },
            AppointmentStatus.Arrived => new[] { AppointmentStatus.Completed },
            AppointmentStatus.Completed => Array.Empty<AppointmentStatus>(),
            _ => Array.Empty<AppointmentStatus>(),
        };

        if (!allowed.Contains(next))
            throw new DomainException($"Cannot transition appointment from {current} to {next}");
    }
}
