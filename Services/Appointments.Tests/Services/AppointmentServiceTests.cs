using DealerArsenal.Appointments.Models;
using DealerArsenal.Appointments.Repositories;
using DealerArsenal.Appointments.Services;
using FluentAssertions;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using Xunit;

namespace DealerArsenal.Appointments.Tests.Services;

public sealed class AppointmentServiceTests
{
    private readonly Mock<IAppointmentRepository> _repositoryMock;
    private readonly AppointmentService _sut;

    public AppointmentServiceTests()
    {
        _repositoryMock = new Mock<IAppointmentRepository>(MockBehavior.Strict);
        _sut = new AppointmentService(_repositoryMock.Object, NullLogger<AppointmentService>.Instance);
    }

    // ─── GetByIdAsync ───────────────────────────────────────────────────────

    [Fact]
    public async Task GetByIdAsync_ExistingId_ReturnsAppointment()
    {
        // Arrange
        var id = Guid.NewGuid();
        var appointment = MakeAppointment(id);
        _repositoryMock.Setup(r => r.GetByIdAsync(id, default)).ReturnsAsync(appointment);

        // Act
        var result = await _sut.GetByIdAsync(id);

        // Assert
        result.Should().BeEquivalentTo(appointment);
    }

    [Fact]
    public async Task GetByIdAsync_NotFound_ThrowsDomainException()
    {
        // Arrange
        var id = Guid.NewGuid();
        _repositoryMock.Setup(r => r.GetByIdAsync(id, default)).ReturnsAsync((Appointment?)null);

        // Act
        var act = async () => await _sut.GetByIdAsync(id);

        // Assert
        await act.Should().ThrowAsync<DomainException>()
            .WithMessage($"Appointment {id} not found");
    }

    // ─── CreateAsync ────────────────────────────────────────────────────────

    [Fact]
    public async Task CreateAsync_ValidFutureDate_ReturnsCreatedAppointment()
    {
        // Arrange
        var request = new CreateAppointmentRequest
        {
            ScheduledAt = DateTime.UtcNow.AddDays(1),
            CustomerName = "Alice Smith",
            CustomerPhone = "555-1234",
        };
        var created = MakeAppointment(Guid.NewGuid(), scheduledAt: request.ScheduledAt);
        _repositoryMock.Setup(r => r.CreateAsync(request, default)).ReturnsAsync(created);

        // Act
        var result = await _sut.CreateAsync(request);

        // Assert
        result.Should().BeEquivalentTo(created);
    }

    [Fact]
    public async Task CreateAsync_PastDate_ThrowsDomainException()
    {
        // Arrange
        var request = new CreateAppointmentRequest
        {
            ScheduledAt = DateTime.UtcNow.AddDays(-1),
            CustomerName = "Bob Jones",
            CustomerPhone = "555-5678",
        };

        // Act
        var act = async () => await _sut.CreateAsync(request);

        // Assert
        await act.Should().ThrowAsync<DomainException>()
            .WithMessage("Appointment must be scheduled in the future");
    }

    // ─── UpdateStatusAsync ──────────────────────────────────────────────────

    [Theory]
    [InlineData(AppointmentStatus.Scheduled, AppointmentStatus.Confirmed)]
    [InlineData(AppointmentStatus.Confirmed, AppointmentStatus.Arrived)]
    [InlineData(AppointmentStatus.Arrived, AppointmentStatus.Completed)]
    public async Task UpdateStatusAsync_ValidTransition_ReturnsUpdatedAppointment(
        AppointmentStatus current, AppointmentStatus next)
    {
        // Arrange
        var id = Guid.NewGuid();
        var existing = MakeAppointment(id, status: current);
        var updated = MakeAppointment(id, status: next);
        var request = new UpdateAppointmentStatusRequest { Status = next };

        _repositoryMock.Setup(r => r.GetByIdAsync(id, default)).ReturnsAsync(existing);
        _repositoryMock.Setup(r => r.UpdateStatusAsync(id, next, default)).ReturnsAsync(updated);

        // Act
        var result = await _sut.UpdateStatusAsync(id, request);

        // Assert
        result.Status.Should().Be(next);
    }

    [Fact]
    public async Task UpdateStatusAsync_InvalidTransition_ThrowsDomainException()
    {
        // Arrange
        var id = Guid.NewGuid();
        var existing = MakeAppointment(id, status: AppointmentStatus.Completed);
        var request = new UpdateAppointmentStatusRequest { Status = AppointmentStatus.Scheduled };

        _repositoryMock.Setup(r => r.GetByIdAsync(id, default)).ReturnsAsync(existing);

        // Act
        var act = async () => await _sut.UpdateStatusAsync(id, request);

        // Assert
        await act.Should().ThrowAsync<DomainException>()
            .WithMessage("Cannot transition appointment from Completed to Scheduled");
    }

    [Fact]
    public async Task UpdateStatusAsync_NotFound_ThrowsDomainException()
    {
        // Arrange
        var id = Guid.NewGuid();
        var request = new UpdateAppointmentStatusRequest { Status = AppointmentStatus.Confirmed };
        _repositoryMock.Setup(r => r.GetByIdAsync(id, default)).ReturnsAsync((Appointment?)null);

        // Act
        var act = async () => await _sut.UpdateStatusAsync(id, request);

        // Assert
        await act.Should().ThrowAsync<DomainException>()
            .WithMessage($"Appointment {id} not found");
    }

    // ─── GetVehicleReadinessAsync ────────────────────────────────────────────

    [Fact]
    public async Task GetVehicleReadinessAsync_ExistingAppointment_ReturnsReadiness()
    {
        // Arrange
        var id = Guid.NewGuid();
        var appointment = MakeAppointment(id);
        var readiness = new VehicleReadiness
        {
            StockNumber = "A001",
            LocationStatus = "On-lot",
            ReconStatus = "Complete",
            KeysStatus = "Available",
        };

        _repositoryMock.Setup(r => r.GetByIdAsync(id, default)).ReturnsAsync(appointment);
        _repositoryMock.Setup(r => r.GetVehicleReadinessAsync(id, default)).ReturnsAsync(readiness);

        // Act
        var result = await _sut.GetVehicleReadinessAsync(id);

        // Assert
        result.Should().BeEquivalentTo(readiness);
    }

    [Fact]
    public async Task GetVehicleReadinessAsync_NotFound_ThrowsDomainException()
    {
        // Arrange
        var id = Guid.NewGuid();
        _repositoryMock.Setup(r => r.GetByIdAsync(id, default)).ReturnsAsync((Appointment?)null);

        // Act
        var act = async () => await _sut.GetVehicleReadinessAsync(id);

        // Assert
        await act.Should().ThrowAsync<DomainException>()
            .WithMessage($"Appointment {id} not found");
    }

    // ─── CreateFollowUpAsync ─────────────────────────────────────────────────

    [Fact]
    public async Task CreateFollowUpAsync_ValidRequest_ReturnsFollowUp()
    {
        // Arrange
        var id = Guid.NewGuid();
        var appointment = MakeAppointment(id);
        var request = new CreateFollowUpRequest
        {
            ScheduledAt = DateTime.UtcNow.AddDays(2),
            Note = "Call customer to confirm arrival",
        };
        var followUp = new FollowUpTask
        {
            AppointmentId = id,
            ScheduledAt = request.ScheduledAt,
            Note = request.Note,
        };

        _repositoryMock.Setup(r => r.GetByIdAsync(id, default)).ReturnsAsync(appointment);
        _repositoryMock.Setup(r => r.CreateFollowUpAsync(id, request, default)).ReturnsAsync(followUp);

        // Act
        var result = await _sut.CreateFollowUpAsync(id, request);

        // Assert
        result.Should().BeEquivalentTo(followUp);
    }

    [Fact]
    public async Task CreateFollowUpAsync_PastDate_ThrowsDomainException()
    {
        // Arrange
        var id = Guid.NewGuid();
        var appointment = MakeAppointment(id);
        var request = new CreateFollowUpRequest
        {
            ScheduledAt = DateTime.UtcNow.AddDays(-1),
            Note = "Stale note",
        };

        _repositoryMock.Setup(r => r.GetByIdAsync(id, default)).ReturnsAsync(appointment);

        // Act
        var act = async () => await _sut.CreateFollowUpAsync(id, request);

        // Assert
        await act.Should().ThrowAsync<DomainException>()
            .WithMessage("Follow-up must be scheduled in the future");
    }

    [Fact]
    public async Task CreateFollowUpAsync_AppointmentNotFound_ThrowsDomainException()
    {
        // Arrange
        var id = Guid.NewGuid();
        var request = new CreateFollowUpRequest
        {
            ScheduledAt = DateTime.UtcNow.AddDays(1),
            Note = "Check in",
        };
        _repositoryMock.Setup(r => r.GetByIdAsync(id, default)).ReturnsAsync((Appointment?)null);

        // Act
        var act = async () => await _sut.CreateFollowUpAsync(id, request);

        // Assert
        await act.Should().ThrowAsync<DomainException>()
            .WithMessage($"Appointment {id} not found");
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    private static Appointment MakeAppointment(
        Guid id,
        AppointmentStatus status = AppointmentStatus.Scheduled,
        DateTime? scheduledAt = null) =>
        new()
        {
            Id = id,
            ScheduledAt = scheduledAt ?? DateTime.UtcNow.AddDays(1),
            Status = status,
            CustomerName = "Test Customer",
            CustomerPhone = "555-0000",
        };
}
