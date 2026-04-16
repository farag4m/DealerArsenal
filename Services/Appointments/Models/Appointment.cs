namespace DealerArsenal.Appointments.Models;

public enum AppointmentStatus
{
    Scheduled,
    Confirmed,
    Arrived,
    Completed,
}

public sealed record Appointment
{
    public required Guid Id { get; init; }
    public required DateTime ScheduledAt { get; init; }
    public required AppointmentStatus Status { get; init; }
    public required string CustomerName { get; init; }
    public required string CustomerPhone { get; init; }
    public string? AssignedStaffId { get; init; }
    public string? VehicleStockNumber { get; init; }
    public string? Notes { get; init; }
    public DateTime? FollowUpAt { get; init; }
    public string? FollowUpNote { get; init; }
}

public sealed record VehicleReadiness
{
    public required string StockNumber { get; init; }
    public required string LocationStatus { get; init; }
    public required string ReconStatus { get; init; }
    public required string KeysStatus { get; init; }
}

public sealed record FollowUpTask
{
    public required Guid AppointmentId { get; init; }
    public required DateTime ScheduledAt { get; init; }
    public required string Note { get; init; }
}
