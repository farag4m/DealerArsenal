using Appraisals.Models;
using Appraisals.Models.Dto;
using Appraisals.Repositories;
using Appraisals.Services;
using Microsoft.Extensions.Logging;
using Moq;

namespace Appraisals.Tests;

public sealed class AppraisalServiceTests
{
    private readonly Mock<IAppraisalRepository> _repoMock;
    private readonly Mock<ILogger<AppraisalService>> _loggerMock;
    private readonly AppraisalService _sut;

    public AppraisalServiceTests()
    {
        _repoMock = new Mock<IAppraisalRepository>();
        _loggerMock = new Mock<ILogger<AppraisalService>>();
        _sut = new AppraisalService(_repoMock.Object, _loggerMock.Object);
    }

    // ── GetQueueAsync ─────────────────────────────────────────────────────────

    [Fact]
    public async Task GetQueueAsync_ReturnsPagedResponse_WithMappedItems()
    {
        // Arrange
        var appraisal = MakeAppraisal("appr-1", AppraisalStatus.New);
        _repoMock
            .Setup(r => r.GetQueueAsync(It.IsAny<AppraisalFilterRequest>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(([appraisal], 1));

        var filter = new AppraisalFilterRequest { Page = 1, PageSize = 25 };

        // Act
        var result = await _sut.GetQueueAsync(filter);

        // Assert
        Assert.True(result.Total == 1);
        Assert.Single(result.Items);
        Assert.Equal("appr-1", result.Items[0].Id);
        Assert.Equal("New", result.Items[0].Status);
    }

    // ── GetByIdAsync ──────────────────────────────────────────────────────────

    [Fact]
    public async Task GetByIdAsync_ExistingId_ReturnsResponse()
    {
        // Arrange
        var appraisal = MakeAppraisal("appr-1", AppraisalStatus.UnderReview);
        _repoMock
            .Setup(r => r.GetByIdAsync("appr-1", It.IsAny<CancellationToken>()))
            .ReturnsAsync(appraisal);

        // Act
        var result = await _sut.GetByIdAsync("appr-1");

        // Assert
        Assert.Equal("appr-1", result.Id);
        Assert.Equal("UnderReview", result.Status);
    }

    [Fact]
    public async Task GetByIdAsync_NotFound_ThrowsAppraisalNotFoundException()
    {
        // Arrange
        _repoMock
            .Setup(r => r.GetByIdAsync("missing", It.IsAny<CancellationToken>()))
            .ReturnsAsync((Appraisal?)null);

        // Act & Assert
        var ex = await Assert.ThrowsAsync<AppraisalNotFoundException>(
            () => _sut.GetByIdAsync("missing"));

        Assert.Equal("missing", ex.AppraisalId);
    }

    // ── UpdateStatusAsync ─────────────────────────────────────────────────────

    [Fact]
    public async Task UpdateStatusAsync_ValidTransition_ReturnsUpdatedAppraisal()
    {
        // Arrange
        var appraisal = MakeAppraisal("appr-1", AppraisalStatus.New);
        var updated = MakeAppraisal("appr-1", AppraisalStatus.UnderReview);

        _repoMock.Setup(r => r.GetByIdAsync("appr-1", It.IsAny<CancellationToken>())).ReturnsAsync(appraisal);
        _repoMock.Setup(r => r.UpdateStatusAsync("appr-1", AppraisalStatus.UnderReview, It.IsAny<CancellationToken>()))
                 .ReturnsAsync(updated);

        var request = new UpdateStatusRequest { Status = "UnderReview" };

        // Act
        var result = await _sut.UpdateStatusAsync("appr-1", request);

        // Assert
        Assert.Equal("UnderReview", result.Status);
    }

    [Fact]
    public async Task UpdateStatusAsync_InvalidStatus_ThrowsAppraisalDomainException()
    {
        // Arrange
        var appraisal = MakeAppraisal("appr-1", AppraisalStatus.New);
        _repoMock.Setup(r => r.GetByIdAsync("appr-1", It.IsAny<CancellationToken>())).ReturnsAsync(appraisal);

        var request = new UpdateStatusRequest { Status = "NotARealStatus" };

        // Act & Assert
        await Assert.ThrowsAsync<AppraisalDomainException>(
            () => _sut.UpdateStatusAsync("appr-1", request));
    }

    [Fact]
    public async Task UpdateStatusAsync_DisallowedTransition_ThrowsAppraisalDomainException()
    {
        // Arrange — cannot go from New → Acquired
        var appraisal = MakeAppraisal("appr-1", AppraisalStatus.New);
        _repoMock.Setup(r => r.GetByIdAsync("appr-1", It.IsAny<CancellationToken>())).ReturnsAsync(appraisal);

        var request = new UpdateStatusRequest { Status = "Acquired" };

        // Act & Assert
        await Assert.ThrowsAsync<AppraisalDomainException>(
            () => _sut.UpdateStatusAsync("appr-1", request));
    }

    [Fact]
    public async Task UpdateStatusAsync_NotFound_ThrowsAppraisalNotFoundException()
    {
        // Arrange
        _repoMock.Setup(r => r.GetByIdAsync("x", It.IsAny<CancellationToken>())).ReturnsAsync((Appraisal?)null);

        var request = new UpdateStatusRequest { Status = "UnderReview" };

        // Act & Assert
        await Assert.ThrowsAsync<AppraisalNotFoundException>(
            () => _sut.UpdateStatusAsync("x", request));
    }

    // ── RecordOfferAsync ──────────────────────────────────────────────────────

    [Fact]
    public async Task RecordOfferAsync_WhenUnderReview_RecordsOffer()
    {
        // Arrange
        var appraisal = MakeAppraisal("appr-1", AppraisalStatus.UnderReview);
        var expiry = DateTime.UtcNow.AddDays(3);
        var updated = appraisal with { OfferAmount = 12000m, OfferExpiry = expiry, Status = AppraisalStatus.OfferMade };

        _repoMock.Setup(r => r.GetByIdAsync("appr-1", It.IsAny<CancellationToken>())).ReturnsAsync(appraisal);
        _repoMock.Setup(r => r.RecordOfferAsync("appr-1", 12000m, expiry, It.IsAny<CancellationToken>()))
                 .ReturnsAsync(updated);

        var request = new RecordOfferRequest { Amount = 12000m, ExpiresAt = expiry };

        // Act
        var result = await _sut.RecordOfferAsync("appr-1", request);

        // Assert
        Assert.Equal(12000m, result.OfferAmount);
        Assert.Equal("OfferMade", result.Status);
    }

    [Fact]
    public async Task RecordOfferAsync_WhenNotUnderReview_ThrowsAppraisalDomainException()
    {
        // Arrange
        var appraisal = MakeAppraisal("appr-1", AppraisalStatus.New);
        _repoMock.Setup(r => r.GetByIdAsync("appr-1", It.IsAny<CancellationToken>())).ReturnsAsync(appraisal);

        var request = new RecordOfferRequest { Amount = 5000m, ExpiresAt = DateTime.UtcNow.AddDays(1) };

        // Act & Assert
        await Assert.ThrowsAsync<AppraisalDomainException>(
            () => _sut.RecordOfferAsync("appr-1", request));
    }

    [Fact]
    public async Task RecordOfferAsync_PastExpiry_ThrowsAppraisalDomainException()
    {
        // Arrange
        var appraisal = MakeAppraisal("appr-1", AppraisalStatus.UnderReview);
        _repoMock.Setup(r => r.GetByIdAsync("appr-1", It.IsAny<CancellationToken>())).ReturnsAsync(appraisal);

        var request = new RecordOfferRequest { Amount = 5000m, ExpiresAt = DateTime.UtcNow.AddDays(-1) };

        // Act & Assert
        await Assert.ThrowsAsync<AppraisalDomainException>(
            () => _sut.RecordOfferAsync("appr-1", request));
    }

    // ── AddNoteAsync ──────────────────────────────────────────────────────────

    [Fact]
    public async Task AddNoteAsync_OnActiveAppraisal_AddsNote()
    {
        // Arrange
        var appraisal = MakeAppraisal("appr-1", AppraisalStatus.UnderReview);
        var updated = appraisal with
        {
            Notes =
            [
                new AppraisalNote
                {
                    Id = "note-1",
                    AuthorId = "user-99",
                    AuthorName = "Alice",
                    Content = "Looks good",
                    CreatedAt = DateTime.UtcNow
                }
            ]
        };

        _repoMock.Setup(r => r.GetByIdAsync("appr-1", It.IsAny<CancellationToken>())).ReturnsAsync(appraisal);
        _repoMock.Setup(r => r.AddNoteAsync("appr-1", It.IsAny<AppraisalNote>(), It.IsAny<CancellationToken>()))
                 .ReturnsAsync(updated);

        var request = new AddNoteRequest { AuthorId = "user-99", AuthorName = "Alice", Content = "Looks good" };

        // Act
        var result = await _sut.AddNoteAsync("appr-1", request);

        // Assert
        Assert.Single(result.Notes);
        Assert.Equal("Looks good", result.Notes[0].Content);
    }

    [Fact]
    public async Task AddNoteAsync_OnDeclinedAppraisal_ThrowsAppraisalDomainException()
    {
        // Arrange
        var appraisal = MakeAppraisal("appr-1", AppraisalStatus.Declined);
        _repoMock.Setup(r => r.GetByIdAsync("appr-1", It.IsAny<CancellationToken>())).ReturnsAsync(appraisal);

        var request = new AddNoteRequest { AuthorId = "user-1", AuthorName = "Bob", Content = "Too late" };

        // Act & Assert
        await Assert.ThrowsAsync<AppraisalDomainException>(
            () => _sut.AddNoteAsync("appr-1", request));
    }

    // ── AcquireAsync ──────────────────────────────────────────────────────────

    [Fact]
    public async Task AcquireAsync_WhenAccepted_TriggersAcquisition()
    {
        // Arrange
        var appraisal = MakeAppraisal("appr-1", AppraisalStatus.Accepted);
        var acquired = appraisal with { Status = AppraisalStatus.Acquired };

        _repoMock.Setup(r => r.GetByIdAsync("appr-1", It.IsAny<CancellationToken>())).ReturnsAsync(appraisal);
        _repoMock.Setup(r => r.AcquireAsync("appr-1", It.IsAny<CancellationToken>())).ReturnsAsync(acquired);

        // Act
        var result = await _sut.AcquireAsync("appr-1");

        // Assert
        Assert.Equal("Acquired", result.Status);
        _repoMock.Verify(r => r.AcquireAsync("appr-1", It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task AcquireAsync_WhenNotAccepted_ThrowsAppraisalDomainException()
    {
        // Arrange — OfferMade, not yet Accepted
        var appraisal = MakeAppraisal("appr-1", AppraisalStatus.OfferMade);
        _repoMock.Setup(r => r.GetByIdAsync("appr-1", It.IsAny<CancellationToken>())).ReturnsAsync(appraisal);

        // Act & Assert
        await Assert.ThrowsAsync<AppraisalDomainException>(
            () => _sut.AcquireAsync("appr-1"));
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private static Appraisal MakeAppraisal(string id, AppraisalStatus status) =>
        new()
        {
            Id = id,
            CustomerId = "cust-1",
            CustomerName = "John Doe",
            VehicleYear = "2019",
            VehicleMake = "Toyota",
            VehicleModel = "Camry",
            Status = status,
            SubmittedAt = DateTime.UtcNow.AddDays(-1)
        };
}
