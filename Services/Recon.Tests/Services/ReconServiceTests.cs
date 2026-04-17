using DealerArsenal.Recon.Models;
using DealerArsenal.Recon.Repositories;
using DealerArsenal.Recon.Services;
using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging.Abstractions;
using NSubstitute;
using NSubstitute.ReturnsExtensions;
using Xunit;

namespace DealerArsenal.Recon.Tests.Services;

public sealed class ReconServiceTests
{
    private readonly IReconRepository _repository = Substitute.For<IReconRepository>();
    private readonly IConfiguration _configuration;
    private readonly ReconService _sut;

    public ReconServiceTests()
    {
        var configValues = new Dictionary<string, string?>
        {
            ["Recon:AgingThresholdDays"] = "7"
        };
        _configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(configValues)
            .Build();

        _sut = new ReconService(_repository, NullLogger<ReconService>.Instance, _configuration);
    }

    private static ReconIssue MakeIssue(
        Guid? id = null,
        ReconSegment segment = ReconSegment.NeedsDecision,
        ReconDecision decision = ReconDecision.Pending) =>
        new()
        {
            Id = id ?? Guid.NewGuid(),
            StockNumber = "STK001",
            VehicleDescription = "2022 Toyota Camry",
            Segment = segment,
            Decision = decision,
            CreatedAt = DateTime.UtcNow.AddDays(-3),
            AgeInDays = 3,
        };

    // ── GetQueueAsync ────────────────────────────────────────────────────────

    [Fact]
    public async Task GetQueueAsync_WithMixedSegments_ReturnsSegmentedQueue()
    {
        // Arrange
        var issues = new List<ReconIssue>
        {
            MakeIssue(segment: ReconSegment.NeedsDecision),
            MakeIssue(segment: ReconSegment.NeedsDecision),
            MakeIssue(segment: ReconSegment.InProgress),
            MakeIssue(segment: ReconSegment.WaitingParts),
            MakeIssue(segment: ReconSegment.AtVendor),
            MakeIssue(segment: ReconSegment.Aging),
        };
        _repository.GetAllAsync(Arg.Any<CancellationToken>()).Returns(issues);

        // Act
        var result = await _sut.GetQueueAsync();

        // Assert
        result.NeedsDecision.Should().HaveCount(2);
        result.InProgress.Should().HaveCount(1);
        result.WaitingParts.Should().HaveCount(1);
        result.AtVendor.Should().HaveCount(1);
        result.Aging.Should().HaveCount(1);
    }

    [Fact]
    public async Task GetQueueAsync_WithNoIssues_ReturnsEmptyQueue()
    {
        // Arrange
        _repository.GetAllAsync(Arg.Any<CancellationToken>()).Returns(new List<ReconIssue>());

        // Act
        var result = await _sut.GetQueueAsync();

        // Assert
        result.NeedsDecision.Should().BeEmpty();
        result.InProgress.Should().BeEmpty();
        result.WaitingParts.Should().BeEmpty();
        result.AtVendor.Should().BeEmpty();
        result.Aging.Should().BeEmpty();
    }

    // ── GetIssueAsync ────────────────────────────────────────────────────────

    [Fact]
    public async Task GetIssueAsync_WhenIssueExists_ReturnsIssue()
    {
        // Arrange
        var issue = MakeIssue();
        _repository.GetByIdAsync(issue.Id, Arg.Any<CancellationToken>()).Returns(issue);

        // Act
        var result = await _sut.GetIssueAsync(issue.Id);

        // Assert
        result.Id.Should().Be(issue.Id);
        result.StockNumber.Should().Be("STK001");
    }

    [Fact]
    public async Task GetIssueAsync_WhenIssueNotFound_ThrowsDomainException()
    {
        // Arrange
        var issueId = Guid.NewGuid();
        _repository.GetByIdAsync(issueId, Arg.Any<CancellationToken>()).ReturnsNull();

        // Act
        var act = async () => await _sut.GetIssueAsync(issueId);

        // Assert
        await act.Should().ThrowAsync<DomainException>()
            .WithMessage($"Recon issue {issueId} not found.");
    }

    // ── CreateIssueAsync ─────────────────────────────────────────────────────

    [Fact]
    public async Task CreateIssueAsync_WithValidRequest_ReturnsCreatedIssue()
    {
        // Arrange
        var request = new CreateReconIssueRequest
        {
            StockNumber = "STK123",
            VehicleDescription = "2023 Honda Accord",
            Notes = "Needs paint correction",
        };
        var created = MakeIssue();
        _repository.CreateAsync(request, Arg.Any<CancellationToken>()).Returns(created);

        // Act
        var result = await _sut.CreateIssueAsync(request);

        // Assert
        result.Should().Be(created);
        await _repository.Received(1).CreateAsync(request, Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task CreateIssueAsync_WithEmptyStockNumber_ThrowsDomainException()
    {
        // Arrange
        var request = new CreateReconIssueRequest
        {
            StockNumber = "   ",
            VehicleDescription = "2023 Honda Accord",
        };

        // Act
        var act = async () => await _sut.CreateIssueAsync(request);

        // Assert
        await act.Should().ThrowAsync<DomainException>()
            .WithMessage("StockNumber is required.");
    }

    [Fact]
    public async Task CreateIssueAsync_WithEmptyVehicleDescription_ThrowsDomainException()
    {
        // Arrange
        var request = new CreateReconIssueRequest
        {
            StockNumber = "STK123",
            VehicleDescription = "",
        };

        // Act
        var act = async () => await _sut.CreateIssueAsync(request);

        // Assert
        await act.Should().ThrowAsync<DomainException>()
            .WithMessage("VehicleDescription is required.");
    }

    // ── ApproveIssueAsync ────────────────────────────────────────────────────

    [Fact]
    public async Task ApproveIssueAsync_WithValidBudgetAndPendingIssue_ReturnsApprovedIssue()
    {
        // Arrange
        var issue = MakeIssue(decision: ReconDecision.Pending);
        var approveRequest = new ApproveReconIssueRequest { Budget = 500m };
        var approved = issue with { Decision = ReconDecision.Approved, ApprovedBudget = 500m };

        _repository.GetByIdAsync(issue.Id, Arg.Any<CancellationToken>()).Returns(issue);
        _repository.ApproveAsync(issue.Id, 500m, Arg.Any<CancellationToken>()).Returns(approved);

        // Act
        var result = await _sut.ApproveIssueAsync(issue.Id, approveRequest);

        // Assert
        result.Decision.Should().Be(ReconDecision.Approved);
        result.ApprovedBudget.Should().Be(500m);
    }

    [Fact]
    public async Task ApproveIssueAsync_WithZeroBudget_ThrowsDomainException()
    {
        // Arrange
        var issueId = Guid.NewGuid();
        var request = new ApproveReconIssueRequest { Budget = 0m };

        // Act
        var act = async () => await _sut.ApproveIssueAsync(issueId, request);

        // Assert
        await act.Should().ThrowAsync<DomainException>()
            .WithMessage("Budget must be greater than zero.");
    }

    [Fact]
    public async Task ApproveIssueAsync_WhenIssueNotFound_ThrowsDomainException()
    {
        // Arrange
        var issueId = Guid.NewGuid();
        var request = new ApproveReconIssueRequest { Budget = 300m };
        _repository.GetByIdAsync(issueId, Arg.Any<CancellationToken>()).ReturnsNull();

        // Act
        var act = async () => await _sut.ApproveIssueAsync(issueId, request);

        // Assert
        await act.Should().ThrowAsync<DomainException>()
            .WithMessage($"Recon issue {issueId} not found.");
    }

    [Fact]
    public async Task ApproveIssueAsync_WhenAlreadyDecided_ThrowsDomainException()
    {
        // Arrange
        var issue = MakeIssue(decision: ReconDecision.Approved);
        var request = new ApproveReconIssueRequest { Budget = 300m };
        _repository.GetByIdAsync(issue.Id, Arg.Any<CancellationToken>()).Returns(issue);

        // Act
        var act = async () => await _sut.ApproveIssueAsync(issue.Id, request);

        // Assert
        await act.Should().ThrowAsync<DomainException>()
            .WithMessage($"Recon issue {issue.Id} has already been decided.");
    }

    // ── DenyIssueAsync ───────────────────────────────────────────────────────

    [Fact]
    public async Task DenyIssueAsync_WithValidReasonAndPendingIssue_ReturnsDeniedIssue()
    {
        // Arrange
        var issue = MakeIssue(decision: ReconDecision.Pending);
        var denyRequest = new DenyReconIssueRequest { Reason = "Over budget cap" };
        var denied = issue with { Decision = ReconDecision.Denied, DenialReason = "Over budget cap" };

        _repository.GetByIdAsync(issue.Id, Arg.Any<CancellationToken>()).Returns(issue);
        _repository.DenyAsync(issue.Id, "Over budget cap", Arg.Any<CancellationToken>()).Returns(denied);

        // Act
        var result = await _sut.DenyIssueAsync(issue.Id, denyRequest);

        // Assert
        result.Decision.Should().Be(ReconDecision.Denied);
        result.DenialReason.Should().Be("Over budget cap");
    }

    [Fact]
    public async Task DenyIssueAsync_WithEmptyReason_ThrowsDomainException()
    {
        // Arrange
        var issueId = Guid.NewGuid();
        var request = new DenyReconIssueRequest { Reason = "  " };

        // Act
        var act = async () => await _sut.DenyIssueAsync(issueId, request);

        // Assert
        await act.Should().ThrowAsync<DomainException>()
            .WithMessage("Reason is required when denying a recon issue.");
    }

    [Fact]
    public async Task DenyIssueAsync_WhenAlreadyDecided_ThrowsDomainException()
    {
        // Arrange
        var issue = MakeIssue(decision: ReconDecision.Denied);
        var request = new DenyReconIssueRequest { Reason = "Too expensive" };
        _repository.GetByIdAsync(issue.Id, Arg.Any<CancellationToken>()).Returns(issue);

        // Act
        var act = async () => await _sut.DenyIssueAsync(issue.Id, request);

        // Assert
        await act.Should().ThrowAsync<DomainException>()
            .WithMessage($"Recon issue {issue.Id} has already been decided.");
    }

    // ── AssignIssueAsync ─────────────────────────────────────────────────────

    [Fact]
    public async Task AssignIssueAsync_ToVendor_ReturnsAssignedIssue()
    {
        // Arrange
        var issue = MakeIssue();
        var request = new AssignReconIssueRequest { VendorName = "AutoBody Plus" };
        var assigned = issue with { AssignedToVendor = "AutoBody Plus", Segment = ReconSegment.AtVendor };

        _repository.GetByIdAsync(issue.Id, Arg.Any<CancellationToken>()).Returns(issue);
        _repository.AssignAsync(issue.Id, "AutoBody Plus", null, Arg.Any<CancellationToken>()).Returns(assigned);

        // Act
        var result = await _sut.AssignIssueAsync(issue.Id, request);

        // Assert
        result.AssignedToVendor.Should().Be("AutoBody Plus");
        result.Segment.Should().Be(ReconSegment.AtVendor);
    }

    [Fact]
    public async Task AssignIssueAsync_ToStaff_ReturnsAssignedIssue()
    {
        // Arrange
        var issue = MakeIssue();
        var request = new AssignReconIssueRequest { StaffId = "staff-42" };
        var assigned = issue with { AssignedToStaffId = "staff-42", Segment = ReconSegment.InProgress };

        _repository.GetByIdAsync(issue.Id, Arg.Any<CancellationToken>()).Returns(issue);
        _repository.AssignAsync(issue.Id, null, "staff-42", Arg.Any<CancellationToken>()).Returns(assigned);

        // Act
        var result = await _sut.AssignIssueAsync(issue.Id, request);

        // Assert
        result.AssignedToStaffId.Should().Be("staff-42");
    }

    [Fact]
    public async Task AssignIssueAsync_WithNeitherVendorNorStaff_ThrowsDomainException()
    {
        // Arrange
        var issueId = Guid.NewGuid();
        var request = new AssignReconIssueRequest { VendorName = null, StaffId = null };

        // Act
        var act = async () => await _sut.AssignIssueAsync(issueId, request);

        // Assert
        await act.Should().ThrowAsync<DomainException>()
            .WithMessage("Either VendorName or StaffId must be provided.");
    }

    [Fact]
    public async Task AssignIssueAsync_WithBothVendorAndStaff_ThrowsDomainException()
    {
        // Arrange
        var issueId = Guid.NewGuid();
        var request = new AssignReconIssueRequest { VendorName = "AutoBody Plus", StaffId = "staff-42" };

        // Act
        var act = async () => await _sut.AssignIssueAsync(issueId, request);

        // Assert
        await act.Should().ThrowAsync<DomainException>()
            .WithMessage("Cannot assign to both a vendor and a staff member simultaneously.");
    }

    [Fact]
    public async Task AssignIssueAsync_WhenIssueNotFound_ThrowsDomainException()
    {
        // Arrange
        var issueId = Guid.NewGuid();
        var request = new AssignReconIssueRequest { VendorName = "AutoBody Plus" };
        _repository.GetByIdAsync(issueId, Arg.Any<CancellationToken>()).ReturnsNull();

        // Act
        var act = async () => await _sut.AssignIssueAsync(issueId, request);

        // Assert
        await act.Should().ThrowAsync<DomainException>()
            .WithMessage($"Recon issue {issueId} not found.");
    }

    // ── GetAgingAsync ────────────────────────────────────────────────────────

    [Fact]
    public async Task GetAgingAsync_ReturnsAgingIssuesFromRepository()
    {
        // Arrange
        var agingIssues = new List<ReconIssue>
        {
            MakeIssue(segment: ReconSegment.Aging),
            MakeIssue(segment: ReconSegment.Aging),
        };
        _repository.GetAgingAsync(7, Arg.Any<CancellationToken>()).Returns(agingIssues);

        // Act
        var result = await _sut.GetAgingAsync();

        // Assert
        result.Should().HaveCount(2);
        result.Should().AllSatisfy(i => i.Segment.Should().Be(ReconSegment.Aging));
    }

    [Fact]
    public async Task GetAgingAsync_WithNoAgingIssues_ReturnsEmptyList()
    {
        // Arrange
        _repository.GetAgingAsync(7, Arg.Any<CancellationToken>()).Returns(new List<ReconIssue>());

        // Act
        var result = await _sut.GetAgingAsync();

        // Assert
        result.Should().BeEmpty();
    }
}
