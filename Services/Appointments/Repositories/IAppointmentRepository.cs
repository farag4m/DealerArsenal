using DealerArsenal.Appointments.Models;

namespace DealerArsenal.Appointments.Repositories;

public interface IAppointmentRepository
{
    Task<IReadOnlyList<Appointment>> GetAllAsync(AppointmentListFilter filter, CancellationToken ct = default);
    Task<Appointment?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<Appointment> CreateAsync(CreateAppointmentRequest request, CancellationToken ct = default);
    Task<Appointment> UpdateStatusAsync(Guid id, AppointmentStatus status, CancellationToken ct = default);
    Task<VehicleReadiness> GetVehicleReadinessAsync(Guid id, CancellationToken ct = default);
    Task<FollowUpTask> CreateFollowUpAsync(Guid id, CreateFollowUpRequest request, CancellationToken ct = default);
}
