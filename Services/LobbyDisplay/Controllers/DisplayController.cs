using LobbyDisplay.Models;
using LobbyDisplay.Services;
using Microsoft.AspNetCore.Mvc;

namespace LobbyDisplay.Controllers;

[ApiController]
[Route("api/lobby-display")]
public sealed class DisplayController : ControllerBase
{
    private readonly IDisplayService _service;

    public DisplayController(IDisplayService service)
    {
        _service = service;
    }

    /// <summary>Aggregate snapshot — single call returns all lobby display data.</summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<LobbyDisplaySnapshot>>> GetSnapshot(
        CancellationToken cancellationToken)
    {
        var data = await _service.GetSnapshotAsync(cancellationToken);
        return Ok(ApiResponse<LobbyDisplaySnapshot>.Ok(data));
    }

    [HttpGet("featured")]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<FeaturedVehicle>>>> GetFeatured(
        CancellationToken cancellationToken)
    {
        var data = await _service.GetFeaturedVehiclesAsync(cancellationToken);
        return Ok(ApiResponse<IReadOnlyList<FeaturedVehicle>>.Ok(data));
    }

    [HttpGet("appointments")]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<Appointment>>>> GetAppointments(
        CancellationToken cancellationToken)
    {
        var data = await _service.GetUpcomingAppointmentsAsync(cancellationToken);
        return Ok(ApiResponse<IReadOnlyList<Appointment>>.Ok(data));
    }

    [HttpGet("sold-recent")]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<SoldVehicle>>>> GetSoldRecent(
        CancellationToken cancellationToken)
    {
        var data = await _service.GetRecentlySoldAsync(cancellationToken);
        return Ok(ApiResponse<IReadOnlyList<SoldVehicle>>.Ok(data));
    }

    [HttpGet("dealership")]
    public async Task<ActionResult<ApiResponse<DealershipInfo>>> GetDealership(
        CancellationToken cancellationToken)
    {
        var data = await _service.GetDealershipInfoAsync(cancellationToken);
        return Ok(ApiResponse<DealershipInfo>.Ok(data));
    }

    [HttpGet("reputation")]
    public async Task<ActionResult<ApiResponse<Reputation>>> GetReputation(
        CancellationToken cancellationToken)
    {
        var data = await _service.GetReputationAsync(cancellationToken);
        return Ok(ApiResponse<Reputation>.Ok(data));
    }
}
