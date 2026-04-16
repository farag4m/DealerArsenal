using ControlCenter.Web.Models;

namespace ControlCenter.Web.Configuration;

public static class ServiceRegistry
{
    public static IReadOnlyList<ServiceAreaCard> All { get; } = new List<ServiceAreaCard>
    {
        // ── Vehicle Preparation ──────────────────────────────────────────────
        new ServiceAreaCard
        {
            Id = "intake",
            Title = "Intake",
            Description = "First structured inspection of an arriving vehicle. Capture condition findings, log warning signs, and confirm the basics before the car moves forward.",
            DestinationPath = "/services/intake",
            Group = ServiceGroup.VehiclePreparation,
            RelevantRoles = new[] { UserRole.InventoryLogistics, UserRole.Management },
        },
        new ServiceAreaCard
        {
            Id = "recon",
            Title = "Recon",
            Description = "Manage repair and reconditioning decisions. See what is broken, what needs approval, and what is waiting on parts or shops.",
            DestinationPath = "/services/recon",
            Group = ServiceGroup.VehiclePreparation,
            RelevantRoles = new[] { UserRole.Ownership, UserRole.Management, UserRole.InventoryLogistics },
        },
        new ServiceAreaCard
        {
            Id = "detailing",
            Title = "Detailing",
            Description = "Assign cleaning and finishing work, track blockers, and confirm each vehicle is photo-ready.",
            DestinationPath = "/services/detailing",
            Group = ServiceGroup.VehiclePreparation,
            RelevantRoles = new[] { UserRole.Detailing, UserRole.Management },
        },
        new ServiceAreaCard
        {
            Id = "location",
            Title = "Location",
            Description = "Answer where every car physically is — on-site, at a vendor, or at auction. Confirm vehicle availability before appointments.",
            DestinationPath = "/services/location",
            Group = ServiceGroup.VehiclePreparation,
            RelevantRoles = new[] { UserRole.InventoryLogistics, UserRole.Management },
        },
        new ServiceAreaCard
        {
            Id = "diagnostics",
            Title = "Diagnostics",
            Description = "Review diagnostic sessions, warning codes, and vehicle health clues to support repair decisions and cleaner reconditioning handoffs.",
            DestinationPath = "/services/diagnostics",
            Group = ServiceGroup.VehiclePreparation,
            RelevantRoles = new[] { UserRole.InventoryLogistics, UserRole.Management },
        },
        new ServiceAreaCard
        {
            Id = "service-bay",
            Title = "Service Bay",
            Description = "Advanced vehicle service work: OBD scanning, code library, work orders, inspections, and repair guides.",
            DestinationPath = "/services/service-bay",
            Group = ServiceGroup.VehiclePreparation,
            RelevantRoles = new[] { UserRole.InventoryLogistics, UserRole.Management },
        },
        new ServiceAreaCard
        {
            Id = "operations",
            Title = "Operations",
            Description = "Daily work execution hub. My Day, Board, Team workload, and Tasks & Photos views keep the entire operation moving.",
            DestinationPath = "/services/operations",
            Group = ServiceGroup.VehiclePreparation,
            RelevantRoles = new[] { UserRole.Management, UserRole.InventoryLogistics, UserRole.Detailing, UserRole.Photography },
        },

        // ── Sales & Customer ─────────────────────────────────────────────────
        new ServiceAreaCard
        {
            Id = "vehicles",
            Title = "Vehicles",
            Description = "Main inventory workspace. Search, review status, and manage every active car in the lot.",
            DestinationPath = "/services/vehicles",
            Group = ServiceGroup.SalesAndCustomer,
            RelevantRoles = new[] { UserRole.Ownership, UserRole.Management, UserRole.FrontOfficeBdc, UserRole.InventoryLogistics },
        },
        new ServiceAreaCard
        {
            Id = "customers",
            Title = "Customers",
            Description = "Customer records and relationship tracking. Search, review recent activity, and manage the sales pipeline.",
            DestinationPath = "/services/customers",
            Group = ServiceGroup.SalesAndCustomer,
            RelevantRoles = new[] { UserRole.Management, UserRole.FrontOfficeBdc },
        },
        new ServiceAreaCard
        {
            Id = "appointments",
            Title = "Appointments",
            Description = "Schedule and confirm showroom visits and test drives. Coordinate vehicle prep and assign follow-up responsibility.",
            DestinationPath = "/services/appointments",
            Group = ServiceGroup.SalesAndCustomer,
            RelevantRoles = new[] { UserRole.Management, UserRole.FrontOfficeBdc },
        },
        new ServiceAreaCard
        {
            Id = "appraisals",
            Title = "Appraisals",
            Description = "Review incoming trade-in and sell-your-car requests. Move acquisition opportunities forward.",
            DestinationPath = "/services/appraisals",
            Group = ServiceGroup.SalesAndCustomer,
            RelevantRoles = new[] { UserRole.Management, UserRole.FrontOfficeBdc },
        },
        new ServiceAreaCard
        {
            Id = "sold",
            Title = "Sold",
            Description = "Post-sale follow-through. Track paperwork completeness, delivery readiness, and document uploads for closed deals.",
            DestinationPath = "/services/sold",
            Group = ServiceGroup.SalesAndCustomer,
            RelevantRoles = new[] { UserRole.Ownership, UserRole.Management, UserRole.FrontOfficeBdc, UserRole.TitleAdmin },
        },
        new ServiceAreaCard
        {
            Id = "autocheck",
            Title = "AutoCheck",
            Description = "Vehicle-history and valuation review. Monitor report completion and evaluate auction pricing opportunities.",
            DestinationPath = "/services/autocheck",
            Group = ServiceGroup.SalesAndCustomer,
            RelevantRoles = new[] { UserRole.Ownership, UserRole.Management },
        },

        // ── Financial & Closeout ─────────────────────────────────────────────
        new ServiceAreaCard
        {
            Id = "pricing-engine",
            Title = "Pricing Engine",
            Description = "Valuation and buying discipline. Quick appraisals, auction data, recon rules, and risk rules keep acquisition decisions consistent.",
            DestinationPath = "/services/pricing-engine",
            Group = ServiceGroup.FinancialAndCloseout,
            RelevantRoles = new[] { UserRole.Ownership, UserRole.Management },
        },
        new ServiceAreaCard
        {
            Id = "title",
            Title = "Title",
            Description = "Title and registration follow-through. See pending title items, track paperwork, and confirm compliance deadlines.",
            DestinationPath = "/services/title",
            Group = ServiceGroup.FinancialAndCloseout,
            RelevantRoles = new[] { UserRole.Ownership, UserRole.Management, UserRole.TitleAdmin },
        },
        new ServiceAreaCard
        {
            Id = "reimbursements",
            Title = "Reimbursements",
            Description = "Staff expense and repayment requests. Submit, attach to vehicles or vendors, and track approval status.",
            DestinationPath = "/services/reimbursements",
            Group = ServiceGroup.FinancialAndCloseout,
            RelevantRoles = new[] { UserRole.Ownership, UserRole.Management, UserRole.InventoryLogistics, UserRole.FrontOfficeBdc },
        },
        new ServiceAreaCard
        {
            Id = "accounting",
            Title = "Accounting",
            Description = "Financial workspace with overview, accounts, journal, and recurring expense management.",
            DestinationPath = "/services/accounting",
            Group = ServiceGroup.FinancialAndCloseout,
            RelevantRoles = new[] { UserRole.Ownership, UserRole.Management },
        },
        new ServiceAreaCard
        {
            Id = "vendors",
            Title = "Vendors",
            Description = "Manage outside service partners. Maintain shop and vendor contacts the dealership depends on.",
            DestinationPath = "/services/vendors",
            Group = ServiceGroup.FinancialAndCloseout,
            RelevantRoles = new[] { UserRole.Management, UserRole.InventoryLogistics },
        },

        // ── Command & Control ────────────────────────────────────────────────
        new ServiceAreaCard
        {
            Id = "dashboard",
            Title = "Dashboard",
            Description = "Daily starting point for every role. Highlights urgent work, bottlenecks, and personal task queues.",
            DestinationPath = "/services/dashboard",
            Group = ServiceGroup.CommandAndControl,
            RelevantRoles = new[] { UserRole.Ownership, UserRole.Management, UserRole.FrontOfficeBdc, UserRole.InventoryLogistics, UserRole.Detailing, UserRole.Photography, UserRole.TitleAdmin },
        },
        new ServiceAreaCard
        {
            Id = "automations",
            Title = "Automations",
            Description = "Supervise automatic business actions. Review active rules, activity log, and override exceptions.",
            DestinationPath = "/services/automations",
            Group = ServiceGroup.CommandAndControl,
            RelevantRoles = new[] { UserRole.Ownership, UserRole.Management },
        },
        new ServiceAreaCard
        {
            Id = "settings",
            Title = "Settings",
            Description = "Account, workspace, and security administration. Manage users, roles, and dealership-wide preferences.",
            DestinationPath = "/services/settings",
            Group = ServiceGroup.CommandAndControl,
            RelevantRoles = new[] { UserRole.Ownership, UserRole.Management },
        },
    };
}
