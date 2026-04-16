using DealerArsenal.Appointments.Models;
using DealerArsenal.Appointments.Services;
using Microsoft.AspNetCore.Mvc;

namespace DealerArsenal.Appointments.Controllers;

[ApiController]
[Route("api/appointments")]
public sealed class AppointmentsController : ControllerBase
{
    private readonly IAppointmentService _service;

    public AppointmentsController(IAppointmentService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<Appointment>>>> GetAll(
        [FromQuery] DateTime? date,
        [FromQuery] AppointmentStatus? status,
        [FromQuery] string? assignedStaffId,
        CancellationToken ct)
    {
        var filter = new AppointmentListFilter
        {
            Date = date,
            Status = status,
            AssignedStaffId = assignedStaffId,
        };

        var result = await _service.GetAllAsync(filter, ct);
        return Ok(ApiResponse<IReadOnlyList<Appointment>>.Ok(result));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiResponse<Appointment>>> GetById(Guid id, CancellationToken ct)
    {
        var result = await _service.GetByIdAsync(id, ct);
        return Ok(ApiResponse<Appointment>.Ok(result));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<Appointment>>> Create(
        [FromBody] CreateAppointmentRequest request,
        CancellationToken ct)
    {
        var result = await _service.CreateAsync(request, ct);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, ApiResponse<Appointment>.Ok(result));
    }

    [HttpPatch("{id:guid}/status")]
    public async Task<ActionResult<ApiResponse<Appointment>>> UpdateStatus(
        Guid id,
        [FromBody] UpdateAppointmentStatusRequest request,
        CancellationToken ct)
    {
        var result = await _service.UpdateStatusAsync(id, request, ct);
        return Ok(ApiResponse<Appointment>.Ok(result));
    }

    [HttpGet("{id:guid}/vehicle-readiness")]
    public async Task<ActionResult<ApiResponse<VehicleReadiness>>> GetVehicleReadiness(Guid id, CancellationToken ct)
    {
        var result = await _service.GetVehicleReadinessAsync(id, ct);
        return Ok(ApiResponse<VehicleReadiness>.Ok(result));
    }

    [HttpPost("{id:guid}/followup")]
    public async Task<ActionResult<ApiResponse<FollowUpTask>>> CreateFollowUp(
        Guid id,
        [FromBody] CreateFollowUpRequest request,
        CancellationToken ct)
    {
        var result = await _service.CreateFollowUpAsync(id, request, ct);
        return Ok(ApiResponse<FollowUpTask>.Ok(result));
    }
}
