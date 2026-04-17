using Appraisals.Models;
using Appraisals.Models.Dto;

namespace Appraisals.Services;

public interface IAppraisalService
{
    Task<PagedResponse<AppraisalResponse>> GetQueueAsync(
        AppraisalFilterRequest filter,
        CancellationToken cancellationToken = default);

    Task<AppraisalResponse> GetByIdAsync(string id, CancellationToken cancellationToken = default);

    Task<AppraisalResponse> UpdateStatusAsync(
        string id,
        UpdateStatusRequest request,
        CancellationToken cancellationToken = default);

    Task<AppraisalResponse> RecordOfferAsync(
        string id,
        RecordOfferRequest request,
        CancellationToken cancellationToken = default);

    Task<AppraisalResponse> AddNoteAsync(
        string id,
        AddNoteRequest request,
        CancellationToken cancellationToken = default);

    Task<AppraisalResponse> AcquireAsync(string id, CancellationToken cancellationToken = default);
}
