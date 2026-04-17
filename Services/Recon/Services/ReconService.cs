using DealerArsenal.Recon.Models;
using DealerArsenal.Recon.Repositories;

namespace DealerArsenal.Recon.Services;

public sealed class ReconService : IReconService
{
    private readonly IReconRepository _repository;
    private readonly ILogger<ReconService> _logger;
    private readonly int _agingThresholdDays;

    public ReconService(
        IReconRepository repository,
        ILogger<ReconService> logger,
        IConfiguration configuration)
    {
        _repository = repository;
        _logger = logger;
        _agingThresholdDays = configuration.GetValue<int>("Recon:AgingThresholdDays", 7);
    }

    public async Task<ReconQueue> GetQueueAsync(CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Getting recon queue");

        var all = await _repository.GetAllAsync(cancellationToken);

        var queue = new ReconQueue
        {
            NeedsDecision = all.Where(i => i.Segment == ReconSegment.NeedsDecision).ToList().AsReadOnly(),
            InProgress = all.Where(i => i.Segment == ReconSegment.InProgress).ToList().AsReadOnly(),
            WaitingParts = all.Where(i => i.Segment == ReconSegment.WaitingParts).ToList().AsReadOnly(),
            AtVendor = all.Where(i => i.Segment == ReconSegment.AtVendor).ToList().AsReadOnly(),
            Aging = all.Where(i => i.Segment == ReconSegment.Aging).ToList().AsReadOnly(),
        };

        _logger.LogInformation(
            "Recon queue fetched — needsDecision={NeedsDecision} inProgress={InProgress} waitingParts={WaitingParts} atVendor={AtVendor} aging={Aging}",
            queue.NeedsDecision.Count,
            queue.InProgress.Count,
            queue.WaitingParts.Count,
            queue.AtVendor.Count,
            queue.Aging.Count);

        return queue;
    }

    public async Task<ReconIssue> GetIssueAsync(Guid issueId, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Getting recon issue issueId={IssueId}", issueId);

        var issue = await _repository.GetByIdAsync(issueId, cancellationToken);
        if (issue is null)
        {
            _logger.LogWarning("Recon issue not found issueId={IssueId}", issueId);
            throw new DomainException($"Recon issue {issueId} not found.");
        }

        return issue;
    }

    public async Task<ReconIssue> CreateIssueAsync(CreateReconIssueRequest request, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Creating recon issue stockNumber={StockNumber}", request.StockNumber);

        if (string.IsNullOrWhiteSpace(request.StockNumber))
            throw new DomainException("StockNumber is required.");

        if (string.IsNullOrWhiteSpace(request.VehicleDescription))
            throw new DomainException("VehicleDescription is required.");

        var issue = await _repository.CreateAsync(request, cancellationToken);

        _logger.LogInformation("Recon issue created issueId={IssueId} stockNumber={StockNumber}", issue.Id, issue.StockNumber);

        return issue;
    }

    public async Task<ReconIssue> ApproveIssueAsync(Guid issueId, ApproveReconIssueRequest request, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Approving recon issue issueId={IssueId} budget={Budget}", issueId, request.Budget);

        if (request.Budget <= 0)
            throw new DomainException("Budget must be greater than zero.");

        var existing = await _repository.GetByIdAsync(issueId, cancellationToken);
        if (existing is null)
            throw new DomainException($"Recon issue {issueId} not found.");

        if (existing.Decision != ReconDecision.Pending)
            throw new DomainException($"Recon issue {issueId} has already been decided.");

        var updated = await _repository.ApproveAsync(issueId, request.Budget, cancellationToken);

        _logger.LogInformation("Recon issue approved issueId={IssueId}", issueId);

        return updated;
    }

    public async Task<ReconIssue> DenyIssueAsync(Guid issueId, DenyReconIssueRequest request, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Denying recon issue issueId={IssueId}", issueId);

        if (string.IsNullOrWhiteSpace(request.Reason))
            throw new DomainException("Reason is required when denying a recon issue.");

        var existing = await _repository.GetByIdAsync(issueId, cancellationToken);
        if (existing is null)
            throw new DomainException($"Recon issue {issueId} not found.");

        if (existing.Decision != ReconDecision.Pending)
            throw new DomainException($"Recon issue {issueId} has already been decided.");

        var updated = await _repository.DenyAsync(issueId, request.Reason, cancellationToken);

        _logger.LogInformation("Recon issue denied issueId={IssueId} reason={Reason}", issueId, request.Reason);

        return updated;
    }

    public async Task<ReconIssue> AssignIssueAsync(Guid issueId, AssignReconIssueRequest request, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Assigning recon issue issueId={IssueId}", issueId);

        if (string.IsNullOrWhiteSpace(request.VendorName) && string.IsNullOrWhiteSpace(request.StaffId))
            throw new DomainException("Either VendorName or StaffId must be provided.");

        if (!string.IsNullOrWhiteSpace(request.VendorName) && !string.IsNullOrWhiteSpace(request.StaffId))
            throw new DomainException("Cannot assign to both a vendor and a staff member simultaneously.");

        var existing = await _repository.GetByIdAsync(issueId, cancellationToken);
        if (existing is null)
            throw new DomainException($"Recon issue {issueId} not found.");

        var updated = await _repository.AssignAsync(issueId, request.VendorName, request.StaffId, cancellationToken);

        _logger.LogInformation("Recon issue assigned issueId={IssueId} vendor={Vendor} staffId={StaffId}", issueId, request.VendorName, request.StaffId);

        return updated;
    }

    public async Task<IReadOnlyList<ReconIssue>> GetAgingAsync(CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Getting aging recon issues thresholdDays={ThresholdDays}", _agingThresholdDays);

        var aging = await _repository.GetAgingAsync(_agingThresholdDays, cancellationToken);

        _logger.LogInformation("Aging recon issues fetched count={Count}", aging.Count);

        return aging;
    }
}
