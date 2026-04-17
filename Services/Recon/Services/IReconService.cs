using DealerArsenal.Recon.Models;

namespace DealerArsenal.Recon.Services;

public interface IReconService
{
    Task<ReconQueue> GetQueueAsync(CancellationToken cancellationToken = default);
    Task<ReconIssue> GetIssueAsync(Guid issueId, CancellationToken cancellationToken = default);
    Task<ReconIssue> CreateIssueAsync(CreateReconIssueRequest request, CancellationToken cancellationToken = default);
    Task<ReconIssue> ApproveIssueAsync(Guid issueId, ApproveReconIssueRequest request, CancellationToken cancellationToken = default);
    Task<ReconIssue> DenyIssueAsync(Guid issueId, DenyReconIssueRequest request, CancellationToken cancellationToken = default);
    Task<ReconIssue> AssignIssueAsync(Guid issueId, AssignReconIssueRequest request, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<ReconIssue>> GetAgingAsync(CancellationToken cancellationToken = default);
}
