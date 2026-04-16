namespace ControlCenter.Web.Models;

public enum UserRole
{
    Ownership,
    Management,
    FrontOfficeBdc,
    InventoryLogistics,
    Detailing,
    Photography,
    TitleAdmin,
}

public enum ServiceGroup
{
    VehiclePreparation,
    SalesAndCustomer,
    FinancialAndCloseout,
    CommandAndControl,
}

public sealed record ServiceAreaCard
{
    public required string Id { get; init; }
    public required string Title { get; init; }
    public required string Description { get; init; }
    public required string DestinationPath { get; init; }
    public required ServiceGroup Group { get; init; }
    public required IReadOnlyList<UserRole> RelevantRoles { get; init; }
}
