using DealerArsenal.Recon.Models;

namespace DealerArsenal.Recon.Repositories;

public interface IReconRepository
{
    Task<IReadOnlyList<ReconIssue>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<ReconIssue?> GetByIdAsync(Guid issueId, CancellationToken cancellationToken = default);
    Task<ReconIssue> CreateAsync(CreateReconIssueRequest request, CancellationToken cancellationToken = default);
    Task<ReconIssue> ApproveAsync(Guid issueId, decimal budget, CancellationToken cancellationToken = default);
    Task<ReconIssue> DenyAsync(Guid issueId, string reason, CancellationToken cancellationToken = default);
    Task<ReconIssue> AssignAsync(Guid issueId, string? vendorName, string? staffId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<ReconIssue>> GetAgingAsync(int agingThresholdDays, CancellationToken cancellationToken = default);
}
