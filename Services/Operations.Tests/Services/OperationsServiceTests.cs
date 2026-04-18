using DealerArsenal.Operations.Infrastructure;
using DealerArsenal.Operations.Models;
using DealerArsenal.Operations.Repositories;
using DealerArsenal.Operations.Services;
using FluentAssertions;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using Xunit;

namespace DealerArsenal.Operations.Tests.Services;

/// <summary>
/// Unit tests for OperationsService.
/// All repository calls are mocked — no real HTTP or DB access.
/// </summary>
public sealed class OperationsServiceTests
{
    private readonly Mock<IOperationsRepository> _repositoryMock;
    private readonly OperationsService _sut;

    public OperationsServiceTests()
    {
        _repositoryMock = new Mock<IOperationsRepository>(MockBehavior.Strict);
        _sut = new OperationsService(
            _repositoryMock.Object,
            NullLogger<OperationsService>.Instance);
    }

    // -----------------------------------------------------------------------
    // GetMyDayAsync
    // -----------------------------------------------------------------------

    [Fact]
    public async Task GetMyDay_ValidUserId_ReturnsMyDayResponse()
    {
        // Arrange
        const string userId = "user-123";
        var expected = new MyDayResponse(userId, [], 0, 0, 0);

        _repositoryMock
            .Setup(r => r.GetMyDayAsync(userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(expected);

        // Act
        var result = await _sut.GetMyDayAsync(userId);

        // Assert
        result.Should().BeEquivalentTo(expected);
        _repositoryMock.Verify(r => r.GetMyDayAsync(userId, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public async Task GetMyDay_EmptyOrWhitespaceUserId_ThrowsDomainException(string userId)
    {
        // Act
        var act = async () => await _sut.GetMyDayAsync(userId);

        // Assert
        await act.Should().ThrowAsync<DomainException>()
            .WithMessage("UserId is required");
    }

    // -----------------------------------------------------------------------
    // UpdateTaskAsync — Complete
    // -----------------------------------------------------------------------

    [Fact]
    public async Task UpdateTask_CompleteAction_CallsRepositoryAndReturnsUpdatedTask()
    {
        // Arrange
        const string taskId = "task-abc";
        var request = new TaskUpdateRequest(TaskAction.Complete);
        var expected = MakeTask(taskId, Models.TaskStatus.Completed);

        _repositoryMock
            .Setup(r => r.UpdateTaskAsync(taskId, request, It.IsAny<CancellationToken>()))
            .ReturnsAsync(expected);

        // Act
        var result = await _sut.UpdateTaskAsync(taskId, request);

        // Assert
        result.Should().BeEquivalentTo(expected);
    }

    // -----------------------------------------------------------------------
    // UpdateTaskAsync — Block
    // -----------------------------------------------------------------------

    [Fact]
    public async Task UpdateTask_BlockAction_WithReason_Succeeds()
    {
        // Arrange
        const string taskId = "task-abc";
        var request = new TaskUpdateRequest(TaskAction.Block, BlockReason: "waiting on parts");
        var expected = MakeTask(taskId, Models.TaskStatus.Blocked);

        _repositoryMock
            .Setup(r => r.UpdateTaskAsync(taskId, request, It.IsAny<CancellationToken>()))
            .ReturnsAsync(expected);

        // Act
        var result = await _sut.UpdateTaskAsync(taskId, request);

        // Assert
        result.Status.Should().Be(Models.TaskStatus.Blocked);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public async Task UpdateTask_BlockAction_MissingReason_ThrowsDomainException(string? reason)
    {
        // Arrange
        var request = new TaskUpdateRequest(TaskAction.Block, BlockReason: reason);

        // Act
        var act = async () => await _sut.UpdateTaskAsync("task-1", request);

        // Assert
        await act.Should().ThrowAsync<DomainException>()
            .WithMessage("BlockReason is required when action is Block");
    }

    // -----------------------------------------------------------------------
    // UpdateTaskAsync — Snooze
    // -----------------------------------------------------------------------

    [Fact]
    public async Task UpdateTask_SnoozeAction_FutureDate_Succeeds()
    {
        // Arrange
        const string taskId = "task-abc";
        var snoozeUntil = DateTimeOffset.UtcNow.AddHours(2);
        var request = new TaskUpdateRequest(TaskAction.Snooze, SnoozeUntil: snoozeUntil);
        var expected = MakeTask(taskId, Models.TaskStatus.Snoozed);

        _repositoryMock
            .Setup(r => r.UpdateTaskAsync(taskId, request, It.IsAny<CancellationToken>()))
            .ReturnsAsync(expected);

        // Act
        var result = await _sut.UpdateTaskAsync(taskId, request);

        // Assert
        result.Status.Should().Be(Models.TaskStatus.Snoozed);
    }

    [Fact]
    public async Task UpdateTask_SnoozeAction_NoSnoozeUntil_ThrowsDomainException()
    {
        // Arrange
        var request = new TaskUpdateRequest(TaskAction.Snooze, SnoozeUntil: null);

        // Act
        var act = async () => await _sut.UpdateTaskAsync("task-1", request);

        // Assert
        await act.Should().ThrowAsync<DomainException>()
            .WithMessage("SnoozeUntil is required when action is Snooze");
    }

    [Fact]
    public async Task UpdateTask_SnoozeAction_PastDate_ThrowsDomainException()
    {
        // Arrange
        var request = new TaskUpdateRequest(
            TaskAction.Snooze,
            SnoozeUntil: DateTimeOffset.UtcNow.AddMinutes(-1));

        // Act
        var act = async () => await _sut.UpdateTaskAsync("task-1", request);

        // Assert
        await act.Should().ThrowAsync<DomainException>()
            .WithMessage("SnoozeUntil must be in the future");
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public async Task UpdateTask_EmptyOrWhitespaceTaskId_ThrowsDomainException(string taskId)
    {
        // Arrange
        var request = new TaskUpdateRequest(TaskAction.Complete);

        // Act
        var act = async () => await _sut.UpdateTaskAsync(taskId, request);

        // Assert
        await act.Should().ThrowAsync<DomainException>()
            .WithMessage("TaskId is required");
    }

    // -----------------------------------------------------------------------
    // GetTasksAsync — pagination validation
    // -----------------------------------------------------------------------

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    public async Task GetTasks_PageLessThanOne_ThrowsDomainException(int page)
    {
        // Act
        var act = async () => await _sut.GetTasksAsync(page, 20);

        // Assert
        await act.Should().ThrowAsync<DomainException>()
            .WithMessage("Page must be >= 1");
    }

    [Theory]
    [InlineData(0)]
    [InlineData(101)]
    [InlineData(-5)]
    public async Task GetTasks_InvalidPageSize_ThrowsDomainException(int pageSize)
    {
        // Act
        var act = async () => await _sut.GetTasksAsync(1, pageSize);

        // Assert
        await act.Should().ThrowAsync<DomainException>()
            .WithMessage("PageSize must be between 1 and 100");
    }

    [Fact]
    public async Task GetTasks_ValidPagination_ReturnsTasksResponse()
    {
        // Arrange
        var expected = new TasksResponse([], 0, 1, 20);

        _repositoryMock
            .Setup(r => r.GetTasksAsync(1, 20, It.IsAny<CancellationToken>()))
            .ReturnsAsync(expected);

        // Act
        var result = await _sut.GetTasksAsync(1, 20);

        // Assert
        result.Should().BeEquivalentTo(expected);
    }

    // -----------------------------------------------------------------------
    // GetStaffDayAsync
    // -----------------------------------------------------------------------

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public async Task GetStaffDay_EmptyStaffId_ThrowsDomainException(string staffId)
    {
        // Act
        var act = async () => await _sut.GetStaffDayAsync(staffId);

        // Assert
        await act.Should().ThrowAsync<DomainException>()
            .WithMessage("StaffId is required");
    }

    [Fact]
    public async Task GetStaffDay_ValidStaffId_ReturnsStaffDayResponse()
    {
        // Arrange
        const string staffId = "staff-456";
        var expected = new StaffDayResponse(staffId, "Jane Doe", [], 0);

        _repositoryMock
            .Setup(r => r.GetStaffDayAsync(staffId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(expected);

        // Act
        var result = await _sut.GetStaffDayAsync(staffId);

        // Assert
        result.Should().BeEquivalentTo(expected);
    }

    // -----------------------------------------------------------------------
    // GetBoardAsync / GetTeamAsync / GetPhotosAsync — delegation tests
    // -----------------------------------------------------------------------

    [Fact]
    public async Task GetBoard_CallsRepository_ReturnsResult()
    {
        // Arrange
        var expected = new BoardResponse([], 0);
        _repositoryMock
            .Setup(r => r.GetBoardAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(expected);

        // Act
        var result = await _sut.GetBoardAsync();

        // Assert
        result.Should().BeEquivalentTo(expected);
    }

    [Fact]
    public async Task GetTeam_CallsRepository_ReturnsResult()
    {
        // Arrange
        var expected = new TeamResponse([], 0);
        _repositoryMock
            .Setup(r => r.GetTeamAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(expected);

        // Act
        var result = await _sut.GetTeamAsync();

        // Assert
        result.Should().BeEquivalentTo(expected);
    }

    [Fact]
    public async Task GetPhotos_CallsRepository_ReturnsResult()
    {
        // Arrange
        var expected = new PhotosResponse([], 0, 0);
        _repositoryMock
            .Setup(r => r.GetPhotosAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(expected);

        // Act
        var result = await _sut.GetPhotosAsync();

        // Assert
        result.Should().BeEquivalentTo(expected);
    }

    // -----------------------------------------------------------------------
    // Helpers
    // -----------------------------------------------------------------------

    private static TaskDto MakeTask(string id, Models.TaskStatus status) =>
        new(
            Id: id,
            Title: "Test task",
            Status: status,
            Priority: TaskPriority.Normal,
            AssignedToId: null,
            AssignedToName: null,
            VehicleId: null,
            StockNumber: null,
            VehicleDescription: null,
            CreatedAt: DateTimeOffset.UtcNow,
            DueAt: null,
            SnoozedUntil: null,
            BlockReason: null);
}
