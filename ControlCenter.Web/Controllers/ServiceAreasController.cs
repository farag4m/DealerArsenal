using ControlCenter.Web.Configuration;
using ControlCenter.Web.Models;
using Microsoft.AspNetCore.Mvc;

namespace ControlCenter.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class ServiceAreasController : ControllerBase
{
    private readonly ILogger<ServiceAreasController> _logger;

    public ServiceAreasController(ILogger<ServiceAreasController> logger)
    {
        _logger = logger;
    }

    /// <summary>
    /// Returns all service area cards. Clients filter by role client-side using the
    /// RelevantRoles list on each card.
    /// </summary>
    [HttpGet]
    public ActionResult<IReadOnlyList<ServiceAreaCardDto>> GetAll()
    {
        var correlationId = HttpContext.Items["CorrelationId"]?.ToString() ?? string.Empty;

        _logger.LogInformation(
            "ServiceAreas requested. CorrelationId={CorrelationId} Count={Count}",
            correlationId,
            ServiceRegistry.All.Count);

        var dtos = ServiceRegistry.All
            .Select(card => new ServiceAreaCardDto(
                card.Id,
                card.Title,
                card.Description,
                card.DestinationPath,
                card.Group.ToString(),
                card.RelevantRoles.Select(r => r.ToString()).ToArray()))
            .ToList();

        return Ok(dtos);
    }
}

public sealed record ServiceAreaCardDto(
    string Id,
    string Title,
    string Description,
    string DestinationPath,
    string Group,
    string[] RelevantRoles);
