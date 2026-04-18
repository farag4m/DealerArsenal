using Customers.Models;
using Customers.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace Customers.Controllers;

[ApiController]
[Route("api/customers")]
[Authorize]
[EnableRateLimiting("fixed")]
public sealed class CustomersController : ControllerBase
{
    private readonly ICustomersService _service;
    private readonly ILogger<CustomersController> _logger;

    public CustomersController(ICustomersService service, ILogger<CustomersController> logger)
    {
        _service = service;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] CustomerSearchParams searchParams, CancellationToken cancellationToken)
    {
        var result = await _service.SearchAsync(searchParams, cancellationToken);
        return Ok(ApiResponse<PagedResult<Customer>>.Ok(result, new { result.TotalPages, result.TotalCount }));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById([FromRoute] string id, CancellationToken cancellationToken)
    {
        var customer = await _service.GetByIdAsync(id, cancellationToken);
        return Ok(ApiResponse<Customer>.Ok(customer));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCustomerRequest request, CancellationToken cancellationToken)
    {
        var customer = await _service.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = customer.Id }, ApiResponse<Customer>.Ok(customer));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update([FromRoute] string id, [FromBody] UpdateCustomerRequest request, CancellationToken cancellationToken)
    {
        var customer = await _service.UpdateAsync(id, request, cancellationToken);
        return Ok(ApiResponse<Customer>.Ok(customer));
    }

    [HttpPost("{id}/notes")]
    public async Task<IActionResult> AddNote([FromRoute] string id, [FromBody] AddNoteRequest request, CancellationToken cancellationToken)
    {
        var authorId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                       ?? throw new UnauthorizedAccessException("User identity not found in token");

        var note = await _service.AddNoteAsync(id, request, authorId, cancellationToken);
        return Ok(ApiResponse<CustomerNote>.Ok(note));
    }
}
