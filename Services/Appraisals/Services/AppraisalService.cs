using Appraisals.Models;
using Appraisals.Models.Dto;
using Appraisals.Repositories;
using Microsoft.Extensions.Logging;

namespace Appraisals.Services;

public sealed class AppraisalService : IAppraisalService
{
    private readonly IAppraisalRepository _repository;
    private readonly ILogger<AppraisalService> _logger;

    private static readonly IReadOnlyDictionary<AppraisalStatus, IReadOnlySet<AppraisalStatus>> AllowedTransitions =
        new Dictionary<AppraisalStatus, IReadOnlySet<AppraisalStatus>>
        {
            [AppraisalStatus.New] = new HashSet<AppraisalStatus> { AppraisalStatus.UnderReview, AppraisalStatus.Declined },
            [AppraisalStatus.UnderReview] = new HashSet<AppraisalStatus> { AppraisalStatus.OfferMade, AppraisalStatus.Declined },
            [AppraisalStatus.OfferMade] = new HashSet<AppraisalStatus> { AppraisalStatus.Accepted, AppraisalStatus.Declined },
            [AppraisalStatus.Accepted] = new HashSet<AppraisalStatus> { AppraisalStatus.Acquired },
            [AppraisalStatus.Declined] = new HashSet<AppraisalStatus>(),
            [AppraisalStatus.Acquired] = new HashSet<AppraisalStatus>()
        };

    public AppraisalService(IAppraisalRepository repository, ILogger<AppraisalService> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public async Task<PagedResponse<AppraisalResponse>> GetQueueAsync(
        AppraisalFilterRequest filter,
        CancellationToken cancellationToken = default)
    {
        _logger.LogInformation(
            "Fetching appraisal queue with status={Status} freshness={FreshnessHours}h assignedTo={AssignedTo} page={Page}",
            filter.Status, filter.FreshnessHours, filter.AssignedTo, filter.Page);

        var (items, total) = await _repository.GetQueueAsync(filter, cancellationToken);

        return new PagedResponse<AppraisalResponse>
        {
            Items = items.Select(AppraisalResponse.FromModel).ToList(),
            Total = total,
            Page = filter.Page,
            PageSize = filter.PageSize
        };
    }

    public async Task<AppraisalResponse> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Fetching appraisal appraisalId={AppraisalId}", id);

        var appraisal = await _repository.GetByIdAsync(id, cancellationToken);

        if (appraisal is null)
        {
            throw new AppraisalNotFoundException(id);
        }

        return AppraisalResponse.FromModel(appraisal);
    }

    public async Task<AppraisalResponse> UpdateStatusAsync(
        string id,
        UpdateStatusRequest request,
        CancellationToken cancellationToken = default)
    {
        if (!Enum.TryParse<AppraisalStatus>(request.Status, ignoreCase: true, out var targetStatus))
        {
            throw new AppraisalDomainException($"Invalid status value: '{request.Status}'.");
        }

        var appraisal = await _repository.GetByIdAsync(id, cancellationToken)
            ?? throw new AppraisalNotFoundException(id);

        if (!AllowedTransitions[appraisal.Status].Contains(targetStatus))
        {
            throw new AppraisalDomainException(
                $"Cannot transition from '{appraisal.Status}' to '{targetStatus}'.");
        }

        _logger.LogInformation(
            "Updating appraisal status appraisalId={AppraisalId} from={From} to={To}",
            id, appraisal.Status, targetStatus);

        var updated = await _repository.UpdateStatusAsync(id, targetStatus, cancellationToken);
        return AppraisalResponse.FromModel(updated);
    }

    public async Task<AppraisalResponse> RecordOfferAsync(
        string id,
        RecordOfferRequest request,
        CancellationToken cancellationToken = default)
    {
        var appraisal = await _repository.GetByIdAsync(id, cancellationToken)
            ?? throw new AppraisalNotFoundException(id);

        if (appraisal.Status != AppraisalStatus.UnderReview)
        {
            throw new AppraisalDomainException(
                $"An offer can only be recorded when the appraisal is UnderReview. Current status: '{appraisal.Status}'.");
        }

        if (request.ExpiresAt <= DateTime.UtcNow)
        {
            throw new AppraisalDomainException("Offer expiry must be in the future.");
        }

        _logger.LogInformation(
            "Recording offer appraisalId={AppraisalId} amount={Amount} expiresAt={ExpiresAt}",
            id, request.Amount, request.ExpiresAt);

        var updated = await _repository.RecordOfferAsync(id, request.Amount, request.ExpiresAt, cancellationToken);
        return AppraisalResponse.FromModel(updated);
    }

    public async Task<AppraisalResponse> AddNoteAsync(
        string id,
        AddNoteRequest request,
        CancellationToken cancellationToken = default)
    {
        var appraisal = await _repository.GetByIdAsync(id, cancellationToken)
            ?? throw new AppraisalNotFoundException(id);

        if (appraisal.Status == AppraisalStatus.Acquired || appraisal.Status == AppraisalStatus.Declined)
        {
            throw new AppraisalDomainException(
                $"Notes cannot be added to a '{appraisal.Status}' appraisal.");
        }

        var note = new AppraisalNote
        {
            Id = Guid.NewGuid().ToString(),
            AuthorId = request.AuthorId,
            AuthorName = request.AuthorName,
            Content = request.Content,
            CreatedAt = DateTime.UtcNow
        };

        _logger.LogInformation(
            "Adding note to appraisal appraisalId={AppraisalId} authorId={AuthorId}",
            id, request.AuthorId);

        var updated = await _repository.AddNoteAsync(id, note, cancellationToken);
        return AppraisalResponse.FromModel(updated);
    }

    public async Task<AppraisalResponse> AcquireAsync(string id, CancellationToken cancellationToken = default)
    {
        var appraisal = await _repository.GetByIdAsync(id, cancellationToken)
            ?? throw new AppraisalNotFoundException(id);

        if (appraisal.Status != AppraisalStatus.Accepted)
        {
            throw new AppraisalDomainException(
                $"Acquisition can only be triggered on an Accepted appraisal. Current status: '{appraisal.Status}'.");
        }

        _logger.LogInformation("Triggering acquisition appraisalId={AppraisalId}", id);

        var updated = await _repository.AcquireAsync(id, cancellationToken);
        return AppraisalResponse.FromModel(updated);
    }
}
