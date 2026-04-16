using System.ComponentModel.DataAnnotations;

namespace DealerArsenal.Appointments.Models;

public sealed record CreateAppointmentRequest
{
    [Required]
    public required DateTime ScheduledAt { get; init; }

    [Required, MinLength(1)]
    public required string CustomerName { get; init; }

    [Required, Phone]
    public required string CustomerPhone { get; init; }

    public string? AssignedStaffId { get; init; }
    public string? VehicleStockNumber { get; init; }
    public string? Notes { get; init; }
}

public sealed record UpdateAppointmentStatusRequest
{
    [Required]
    public required AppointmentStatus Status { get; init; }
}

public sealed record CreateFollowUpRequest
{
    [Required]
    public required DateTime ScheduledAt { get; init; }

    [Required, MinLength(1)]
    public required string Note { get; init; }
}

public sealed record AppointmentListFilter
{
    public DateTime? Date { get; init; }
    public AppointmentStatus? Status { get; init; }
    public string? AssignedStaffId { get; init; }
}
