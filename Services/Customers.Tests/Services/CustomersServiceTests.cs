using Customers.Models;
using Customers.Repositories;
using Customers.Services;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Customers.Tests.Services;

public sealed class CustomersServiceTests
{
    private readonly Mock<ICustomersRepository> _repositoryMock;
    private readonly Mock<ILogger<CustomersService>> _loggerMock;
    private readonly CustomersService _sut;

    public CustomersServiceTests()
    {
        _repositoryMock = new Mock<ICustomersRepository>();
        _loggerMock = new Mock<ILogger<CustomersService>>();
        _sut = new CustomersService(_repositoryMock.Object, _loggerMock.Object);
    }

    // --- SearchAsync ---

    [Fact]
    public async Task SearchAsync_ValidParams_ReturnsPagedResult()
    {
        var searchParams = new CustomerSearchParams { Page = 1, PageSize = 10 };
        var expected = new PagedResult<Customer>
        {
            Items = [new Customer { Id = "c1", FirstName = "John", LastName = "Doe", Email = "j@example.com", Phone = "555-0001" }],
            TotalCount = 1,
            Page = 1,
            PageSize = 10
        };
        _repositoryMock.Setup(r => r.SearchAsync(searchParams, default)).ReturnsAsync(expected);

        var result = await _sut.SearchAsync(searchParams);

        result.Should().BeEquivalentTo(expected);
    }

    [Fact]
    public async Task SearchAsync_InvalidPage_ThrowsArgumentException()
    {
        var searchParams = new CustomerSearchParams { Page = 0, PageSize = 10 };

        var act = async () => await _sut.SearchAsync(searchParams);

        await act.Should().ThrowAsync<ArgumentException>().WithMessage("*Page*");
    }

    [Fact]
    public async Task SearchAsync_PageSizeTooLarge_ThrowsArgumentException()
    {
        var searchParams = new CustomerSearchParams { Page = 1, PageSize = 200 };

        var act = async () => await _sut.SearchAsync(searchParams);

        await act.Should().ThrowAsync<ArgumentException>().WithMessage("*PageSize*");
    }

    [Fact]
    public async Task SearchAsync_PageSizeZero_ThrowsArgumentException()
    {
        var searchParams = new CustomerSearchParams { Page = 1, PageSize = 0 };

        var act = async () => await _sut.SearchAsync(searchParams);

        await act.Should().ThrowAsync<ArgumentException>().WithMessage("*PageSize*");
    }

    // --- GetByIdAsync ---

    [Fact]
    public async Task GetByIdAsync_ExistingId_ReturnsCustomer()
    {
        var customer = new Customer { Id = "c1", FirstName = "Jane", LastName = "Smith", Email = "jane@example.com", Phone = "555-0002" };
        _repositoryMock.Setup(r => r.GetByIdAsync("c1", default)).ReturnsAsync(customer);

        var result = await _sut.GetByIdAsync("c1");

        result.Should().BeEquivalentTo(customer);
    }

    [Fact]
    public async Task GetByIdAsync_NotFound_ThrowsKeyNotFoundException()
    {
        _repositoryMock.Setup(r => r.GetByIdAsync("missing", default)).ReturnsAsync((Customer?)null);

        var act = async () => await _sut.GetByIdAsync("missing");

        await act.Should().ThrowAsync<KeyNotFoundException>().WithMessage("*missing*");
    }

    [Fact]
    public async Task GetByIdAsync_EmptyId_ThrowsArgumentException()
    {
        var act = async () => await _sut.GetByIdAsync(string.Empty);

        await act.Should().ThrowAsync<ArgumentException>().WithMessage("*id*");
    }

    // --- CreateAsync ---

    [Fact]
    public async Task CreateAsync_ValidRequest_ReturnsCreatedCustomer()
    {
        var request = new CreateCustomerRequest { FirstName = "Bob", LastName = "Builder", Email = "bob@example.com", Phone = "555-0003" };
        var expected = new Customer { Id = "c2", FirstName = "Bob", LastName = "Builder", Email = "bob@example.com", Phone = "555-0003" };
        _repositoryMock.Setup(r => r.CreateAsync(request, default)).ReturnsAsync(expected);

        var result = await _sut.CreateAsync(request);

        result.Should().BeEquivalentTo(expected);
    }

    // --- UpdateAsync ---

    [Fact]
    public async Task UpdateAsync_ExistingCustomer_ReturnsUpdatedCustomer()
    {
        var request = new UpdateCustomerRequest { FirstName = "Updated" };
        var expected = new Customer { Id = "c1", FirstName = "Updated", LastName = "Doe", Email = "j@example.com", Phone = "555-0001" };
        _repositoryMock.Setup(r => r.UpdateAsync("c1", request, default)).ReturnsAsync(expected);

        var result = await _sut.UpdateAsync("c1", request);

        result.Should().BeEquivalentTo(expected);
    }

    [Fact]
    public async Task UpdateAsync_NotFound_ThrowsKeyNotFoundException()
    {
        var request = new UpdateCustomerRequest { FirstName = "Updated" };
        _repositoryMock.Setup(r => r.UpdateAsync("missing", request, default)).ReturnsAsync((Customer?)null);

        var act = async () => await _sut.UpdateAsync("missing", request);

        await act.Should().ThrowAsync<KeyNotFoundException>().WithMessage("*missing*");
    }

    [Fact]
    public async Task UpdateAsync_EmptyId_ThrowsArgumentException()
    {
        var request = new UpdateCustomerRequest { FirstName = "Updated" };

        var act = async () => await _sut.UpdateAsync(string.Empty, request);

        await act.Should().ThrowAsync<ArgumentException>().WithMessage("*id*");
    }

    // --- AddNoteAsync ---

    [Fact]
    public async Task AddNoteAsync_ValidInput_ReturnsNote()
    {
        var request = new AddNoteRequest { Content = "Test note content" };
        var expected = new CustomerNote { Id = "n1", CustomerId = "c1", Content = "Test note content", AuthorId = "user1" };
        _repositoryMock.Setup(r => r.AddNoteAsync("c1", request, "user1", default)).ReturnsAsync(expected);

        var result = await _sut.AddNoteAsync("c1", request, "user1");

        result.Should().BeEquivalentTo(expected);
    }

    [Fact]
    public async Task AddNoteAsync_EmptyCustomerId_ThrowsArgumentException()
    {
        var request = new AddNoteRequest { Content = "Note" };

        var act = async () => await _sut.AddNoteAsync(string.Empty, request, "user1");

        await act.Should().ThrowAsync<ArgumentException>().WithMessage("*customerId*");
    }

    [Fact]
    public async Task AddNoteAsync_EmptyAuthorId_ThrowsArgumentException()
    {
        var request = new AddNoteRequest { Content = "Note" };

        var act = async () => await _sut.AddNoteAsync("c1", request, string.Empty);

        await act.Should().ThrowAsync<ArgumentException>().WithMessage("*authorId*");
    }
}
