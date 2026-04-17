using LobbyDisplay.Models;
using LobbyDisplay.Repositories;
using LobbyDisplay.Services;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace LobbyDisplay.Tests.Services;

public sealed class DisplayServiceTests
{
    private readonly Mock<IDisplayRepository> _repositoryMock;
    private readonly Mock<ILogger<DisplayService>> _loggerMock;
    private readonly DisplayService _sut;

    public DisplayServiceTests()
    {
        _repositoryMock = new Mock<IDisplayRepository>();
        _loggerMock = new Mock<ILogger<DisplayService>>();
        _sut = new DisplayService(_repositoryMock.Object, _loggerMock.Object);
    }

    // ── GetFeaturedVehiclesAsync ──────────────────────────────────────────────

    [Fact]
    public async Task GetFeaturedVehiclesAsync_WhenRepositoryReturnsVehicles_ReturnsSameList()
    {
        // Arrange
        var vehicles = new List<FeaturedVehicle>
        {
            new() { PhotoUrl = "https://example.com/img.jpg", Year = 2023, Make = "Toyota", Model = "Camry", Price = 25000m },
            new() { PhotoUrl = "https://example.com/img2.jpg", Year = 2022, Make = "Honda", Model = "Accord", Price = 23000m }
        }.AsReadOnly();

        _repositoryMock
            .Setup(r => r.GetFeaturedVehiclesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(vehicles);

        // Act
        var result = await _sut.GetFeaturedVehiclesAsync();

        // Assert
        Assert.Equal(2, result.Count);
        Assert.Equal("Toyota", result[0].Make);
        Assert.Equal("Honda", result[1].Make);
    }

    [Fact]
    public async Task GetFeaturedVehiclesAsync_WhenRepositoryReturnsEmpty_ReturnsEmptyList()
    {
        // Arrange
        _repositoryMock
            .Setup(r => r.GetFeaturedVehiclesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync([]);

        // Act
        var result = await _sut.GetFeaturedVehiclesAsync();

        // Assert
        Assert.Empty(result);
    }

    // ── GetUpcomingAppointmentsAsync ─────────────────────────────────────────

    [Fact]
    public async Task GetUpcomingAppointmentsAsync_WhenRepositoryReturnsAppointments_ReturnsSameList()
    {
        // Arrange
        var now = DateTimeOffset.UtcNow;
        var appointments = new List<Appointment>
        {
            new() { FirstName = "Alice", ScheduledAt = now.AddHours(1) },
            new() { FirstName = "Bob", ScheduledAt = now.AddHours(2) }
        }.AsReadOnly();

        _repositoryMock
            .Setup(r => r.GetUpcomingAppointmentsAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(appointments);

        // Act
        var result = await _sut.GetUpcomingAppointmentsAsync();

        // Assert
        Assert.Equal(2, result.Count);
        Assert.Equal("Alice", result[0].FirstName);
        Assert.Equal("Bob", result[1].FirstName);
    }

    [Fact]
    public async Task GetUpcomingAppointmentsAsync_WhenRepositoryReturnsEmpty_ReturnsEmptyList()
    {
        // Arrange
        _repositoryMock
            .Setup(r => r.GetUpcomingAppointmentsAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync([]);

        // Act
        var result = await _sut.GetUpcomingAppointmentsAsync();

        // Assert
        Assert.Empty(result);
    }

    // ── GetRecentlySoldAsync ─────────────────────────────────────────────────

    [Fact]
    public async Task GetRecentlySoldAsync_WhenRepositoryReturnsSoldVehicles_ReturnsSameList()
    {
        // Arrange
        var soldDate = DateTimeOffset.UtcNow.AddDays(-1);
        var sold = new List<SoldVehicle>
        {
            new() { Model = "F-150", SoldDate = soldDate },
            new() { Model = "Silverado", SoldDate = soldDate.AddDays(-1) }
        }.AsReadOnly();

        _repositoryMock
            .Setup(r => r.GetRecentlySoldAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(sold);

        // Act
        var result = await _sut.GetRecentlySoldAsync();

        // Assert
        Assert.Equal(2, result.Count);
        Assert.Equal("F-150", result[0].Model);
    }

    [Fact]
    public async Task GetRecentlySoldAsync_WhenRepositoryReturnsEmpty_ReturnsEmptyList()
    {
        // Arrange
        _repositoryMock
            .Setup(r => r.GetRecentlySoldAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync([]);

        // Act
        var result = await _sut.GetRecentlySoldAsync();

        // Assert
        Assert.Empty(result);
    }

    // ── GetDealershipInfoAsync ───────────────────────────────────────────────

    [Fact]
    public async Task GetDealershipInfoAsync_WhenRepositoryReturnsDealershipInfo_ReturnsSameData()
    {
        // Arrange
        var dealership = new DealershipInfo
        {
            Name = "Best Cars Inc.",
            LogoUrl = "https://example.com/logo.png",
            Hours =
            [
                new BusinessHours { Day = "Monday", Open = "09:00", Close = "18:00" }
            ]
        };

        _repositoryMock
            .Setup(r => r.GetDealershipInfoAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(dealership);

        // Act
        var result = await _sut.GetDealershipInfoAsync();

        // Assert
        Assert.Equal("Best Cars Inc.", result.Name);
        Assert.Equal("https://example.com/logo.png", result.LogoUrl);
        Assert.Single(result.Hours);
        Assert.Equal("Monday", result.Hours[0].Day);
    }

    [Fact]
    public async Task GetDealershipInfoAsync_WhenRepositoryThrows_PropagatesException()
    {
        // Arrange
        _repositoryMock
            .Setup(r => r.GetDealershipInfoAsync(It.IsAny<CancellationToken>()))
            .ThrowsAsync(new InvalidOperationException("Dealership info unavailable from DataAPI."));

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(
            () => _sut.GetDealershipInfoAsync());
    }
}
