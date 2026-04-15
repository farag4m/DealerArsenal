# F&F Ops Hub LLM System Spec

## 1. Purpose

This repository is the operating system for F&F Motors, a used-car dealership. It is not a single narrow app. The codebase contains:

1. A current Next.js 16 monolith that serves:
   - the public dealership website
   - the internal dashboard
   - authenticated internal APIs
   - public APIs
   - communications endpoints
   - accounting, appraisal, dispatch, diagnostics, detailing, and automation features
2. A legacy React/Vite frontend in `frontend/`
3. A legacy Express API in `backend/`
4. Supporting automation and infrastructure assets:
   - Prisma/PostgreSQL schema
   - n8n workflows
   - deploy/backup/import scripts
   - Nginx and Docker assets

The current product center of gravity is the root Next.js app under `src/app` and `src/lib`.

## 2. High-Level Architecture

## 2.1 Current Production Architecture

- Frontend and backend are mostly combined in one Next.js monolith.
- UI pages live under `src/app`.
- Server-side business logic lives in `src/lib`.
- HTTP APIs live under `src/app/api`.
- Persistence uses Prisma with PostgreSQL.
- Auth uses NextAuth credentials sessions backed by `UserSession` rows.
- Background/scheduled behavior is split across:
  - internal webhook routes
  - n8n workflows in `n8n/workflows`
  - shell/TS/Python scripts in `scripts/`

## 2.2 Legacy Architecture Still Present in Repo

- `frontend/` is a standalone React/Vite ops dashboard with 21 page components.
- `backend/` is a standalone Express API with 20 mounted route modules.
- Existing docs in the repo describe this older split architecture more than the new monolith.
- These legacy folders still matter for repo understanding, but they are no longer the primary system shape.

## 3. Core System Segments

## 3.1 Public Web Frontend

Public routes live under `src/app/(public)`.

Primary public pages:

- `/`:
  - homepage
  - hero section
  - recently sold section
  - sell/trade CTA
  - reviews
  - dealership differentiation/brand messaging
- `/cars`:
  - public inventory listing
  - search/filter/browse surface backed by public vehicle APIs
- `/car-detail/[stockNumber]`:
  - public vehicle detail page
  - specs, gallery, features, derived VIN data, recommendations, delivery estimate
  - analytics tracking and engagement capture
- `/sell-trade`:
  - consumer appraisal / trade-in funnel
  - SMS-consent-aware form flow
- `/contact`:
  - contact form
  - phone, text, address, hours
- `/privacy`, `/terms`, `/sms-terms`:
  - compliance/legal pages

Public site purpose:

- market inventory
- capture leads
- capture trade/appraisal submissions
- expose inventory data to shoppers
- provide a polished sales-facing website distinct from the internal ops dashboard

## 3.2 Internal Dashboard Frontend

Internal dashboard routes live under `src/app/(dashboard)`.

There are 24 dashboard route folders:

1. `accounting`
2. `appointments`
3. `appraisals`
4. `autocheck`
5. `automations`
6. `customers`
7. `dashboard`
8. `detailing`
9. `diagnostics`
10. `intake`
11. `location`
12. `operations`
13. `people`
14. `photos`
15. `pricing-engine`
16. `recon`
17. `reimbursements`
18. `service-bay`
19. `settings`
20. `sold`
21. `tasks`
22. `title`
23. `vehicles`
24. `vendors`

Important route behavior:

- `people` redirects to `/customers`
- `tasks` redirects to `/operations`
- some features are embedded in other pages rather than being full top-level routes
- visible navigation is role-dependent via `getNavItems()` in `src/lib/auth/rbac.ts`

Global dashboard shell behavior:

- authenticated layout
- sidebar navigation grouped into:
  - main
  - sales
  - pipeline
  - backoffice
  - admin
- top bar
- breadcrumbs
- toast provider
- keyboard shortcuts
- quick action FAB
- mobile search
- active-call bar
- owner-only impersonation wrapper

## 3.3 Lobby Frontend

`/lobby` is a separate customer-facing in-store display.

Purpose:

- show upcoming appointments
- cycle featured vehicles
- show dealer phone/address/QR code
- display dealership social proof and inventory count
- create a polished waiting-room / showroom screen

## 3.4 Internal API / Backend Surface

Current backend endpoints live under `src/app/api`.

This is a large monolith API, not a small CRUD backend. It includes:

- auth/session APIs
- operational CRUD APIs
- domain workflows
- public APIs
- integrations
- webhook receivers
- accounting/tax/payroll services
- communications/call-control endpoints
- hardware-oriented diagnostic/tuning endpoints

Major API groups by top-level namespace:

- `accounting` (24 routes)
- `recon` (15 routes)
- `public` (14 routes)
- `detailing` (11 routes)
- `appraisal-engine` (8 routes)
- `autocheck` (8 routes)
- `customers` (8 routes)
- `vehicles` (8 routes)
- `auth` (7 routes)
- `call` (7 routes)
- `feeds` (7 routes)
- `webhooks` (30 routes)

This makes the API surface much broader than the old Express backend.

## 3.5 Data Layer

The main schema is in `prisma/schema.prisma`.

Important core entities include:

- `User`
- `UserSession`
- `Customer`
- `Lead`
- `Communication`
- `Vehicle`
- `KeyRecord`
- `Vendor`
- `ReconJob`
- `ReconIssue`
- `DetailJob`
- `PhotoJob`
- `TitleRecord`
- `Appointment`
- `Appraisal`
- `SoldDeal`
- `Deposit`
- `Task`
- `Note`
- `CallSettings`
- `ActiveCall`
- `AutomationLog`
- `Notification`
- `Reimbursement`
- `Account`
- `JournalEntry`
- `Bill`
- `RecurringExpense`
- `PayrollRun`
- `Contractor`
- `PTORequest`
- `DiagSession`
- `ServiceOrder`

This is a dealership operations data model, not a generic CRM schema.

## 4. Internal Frontend Spec By Area

## 4.1 Dashboard Home

Route: `/dashboard`

Purpose:

- role-personalized cockpit
- daily operating checklist
- top-3 task prioritization
- morning gate / compliance gating
- command-view / optimization summary

Dashboard variants are role-sensitive:

- `ManagerCockpit`
- `BDCCockpit`
- `OpsCockpit`
- `FieldCockpit`

This is the primary landing surface after login.

## 4.2 Vehicles

Routes:

- `/vehicles`
- `/vehicles/[id]`

Vehicle list purpose:

- browse active inventory
- filter by stage, health, lifecycle
- search by VIN, stock number, make, model, year
- sort operationally, with photo-rich units prioritized
- expose finance fields only to finance-authorized roles

Vehicle detail purpose:

- full operational record for a single unit
- stage and health visibility
- pricing visibility and inline editing for authorized roles
- deposit and sold actions
- VIN decode action
- notes
- photo uploads
- report uploads
- title section
- location section
- recon section
- intake section
- location history / borrower sessions

Vehicle detail acts as the densest single operational page in the system.

## 4.3 Customers

Routes:

- `/customers`
- `/customers/[id]`

Customer list purpose:

- customer search
- active leads summary
- hot leads summary
- appointment activity
- call activity
- duplicate detection banner

Customer detail internal tabs:

1. `Overview`
   - lead context
   - appointments
   - key customer summary
2. `Communications`
   - calls
   - texts
   - communication history
3. `Notes`
   - customer notes feed

Customer sidebar includes:

- editable contact info
- uploaded documents
- timeline

## 4.4 Appointments

Route: `/appointments`

Purpose:

- customer scheduling
- appointment readiness
- arrival prep
- assignee coordination
- linkage to customer and vehicle
- test-drive document handling

This is a sales/BDC-facing operational calendar rather than a generic calendar app.

## 4.5 Appraisals

Route: `/appraisals`

Purpose:

- internal management of inbound appraisal/trade opportunities
- bridge between public appraisal capture and internal valuation workflow

This area is tied to both customer and vehicle acquisition flows.

## 4.6 Recon

Route: `/recon`

Purpose:

- single-page recon pipeline
- no tab split in the current recon page
- identify vehicles that need shop/recon attention based on:
  - active recon issues
  - active recon jobs
  - physical location in shop/vendor zones
  - recon-relevant stage

Displayed concepts:

- recon classification
- issue severity
- suggested actions
- vendor assignment
- estimates vs actuals
- intake warning lights and OBD codes
- days in recon
- lead-interest signal

Recon is one of the system’s highest-value internal modules.

## 4.7 Intake

Route: `/intake`

Purpose:

- first structured inspection of active inventory
- operational readiness capture
- condition-photo and checklist workflow
- OBD / safety-light / cosmetic / road-test intake data

This is the earliest structured ops checkpoint after acquisition.

## 4.8 Detailing

Route: `/detailing`

Purpose:

- dedicated detail-job execution environment
- step engine
- assignee routing
- pause/overage/blocker handling
- predicted vs actual grade
- inspection-derived context from intake

Allowed roles are hardcoded narrower than general RBAC:

- OWNER
- GM
- BDC
- DETAILER

## 4.9 Operations

Route: `/operations`

This is a hybrid page and one of the more important internal hubs.

Top-level internal views:

1. `My Day`
   - personal timeline view
2. `Board`
   - board/kanban operations view
3. `Team`
   - manager-only team view
4. `Tasks & Photos`
   - legacy combined tasks/photos workflow surface

There is also a query-param path for detailing content inside operations, which overlaps with the dedicated detailing route.

Purpose:

- consolidate work execution
- personal daily workflow
- manager oversight
- legacy task/photo continuity

## 4.10 Location

Route: `/location`

Purpose:

- tactical map of inventory placement
- distinguish onsite, street, vendor, auction, and borrowed/employee-held vehicles
- expose frontend flags like:
  - frontline
  - missing
  - showcase
  - ready-for-appointment

This is an operational logistics board for physical vehicle control.

## 4.11 Diagnostics

Route: `/diagnostics`

Purpose:

- diagnostics session list
- DTC visibility
- technician tracking
- readiness data
- search/filter by diagnostic session status

This area is related to but separate from the broader `service-bay` suite.

## 4.12 Service Bay

Route: `/service-bay`

Current route access is restricted to `OWNER` in middleware/RBAC.

Internal tabs:

1. `Overview`
2. `OBD Scanner`
3. `Code Library`
4. `Work Orders`
5. `Inspection`
6. `Repair Guide`

Additional link:

- `ECU Tuning`

Purpose:

- full technician/service workflow
- live OBD and ECU interactions
- inspection workflows
- repair knowledge base
- labor-time support
- service-order management

This is the most technically specialized module in the app.

## 4.13 Pricing Engine

Route: `/pricing-engine`

Internal tabs:

1. `Overview`
2. `Quick Appraise`
3. `Auction Data`
4. `Recon Rules`
5. `Risk Rules`

Purpose:

- auction-data-backed appraisal engine
- offer generation
- condition scoring
- risk modeling
- recon-rule management
- analytics over closed outcomes

This is the dealership’s acquisition/pricing intelligence center.

## 4.14 AutoCheck

Route: `/autocheck`

Internal tabs:

1. `Reports`
2. `Auction Pricer`

Purpose:

- identify active vehicles missing AutoCheck reports
- manage report acquisition progress
- provide valuation / pricing support

Access is currently admin-level only (`admin:settings`).

## 4.15 Sold

Route: `/sold`

Purpose:

- sold deal management
- pending vs delivered vs incomplete filtering
- delivery/paperwork completion
- notice-of-sale / notice-of-purchase tracking
- forms/review/document completion
- deposit lifecycle linkage
- document uploads

This is the post-sale operational closeout surface.

## 4.16 Title

Route: `/title`

Purpose:

- title and DMV processing
- searchable/filterable title board
- compliance tracking for sold or in-process vehicles

## 4.17 Reimbursements

Route: `/reimbursements`

Purpose:

- staff expense submission
- personal-card reimbursement management
- approval flow
- vehicle/vendor association

Visibility rules in code:

- OWNER sees all
- GM sees all except OWNER’s
- everyone else sees only their own reimbursements

## 4.18 Vendors

Route: `/vendors`

Purpose:

- manage shops, detailers, and service providers
- support recon, location, dispatch, and service workflows

## 4.19 Accounting

Route: `/accounting`

Internal tabs:

1. `Overview`
2. `Accounts`
3. `Journal`
4. `Recurring`

Linked deeper features in codebase include:

- reports
- tax center
- payroll
- bills
- bank import
- recurring expenses
- reconciliation
- estimated tax
- tax forms
- partners/contractors/assets

Purpose:

- internal books-like operational accounting
- chart of accounts
- ledger/journal
- recurring postings
- bill tracking
- tax prep support

## 4.20 Automations

Route: `/automations`

Internal tabs:

1. `Automation Rules`
2. `Activity Log`
3. `Overrides`

Purpose:

- inspect automation catalog
- run automations manually
- inspect execution logs
- remove per-vehicle overrides

Route is restricted to OWNER and GM.

## 4.21 Settings

Route: `/settings`

Internal tabs:

1. `General`
2. `Workspace`
3. `Security`

Capabilities include:

- password change
- dealership settings
- call routing settings
- user creation and activation control
- Google Workspace admin functions
- QuickBooks connection status
- security audit

Visibility:

- page exists for all logged-in users
- many management functions are owner-only
- general manager sees some higher-level settings, but ownership powers remain narrower

## 5. Internal Backend Spec By Domain

## 5.1 Auth and Session Management

Files:

- `src/lib/auth/auth.ts`
- `src/lib/auth/rbac.ts`
- `src/middleware.ts`

Behavior:

- NextAuth credentials provider
- bcrypt password check
- per-IP and per-email login rate limit
- DB-backed session tokens via `UserSession`
- session validation against live DB user/session state
- logout deletes active device session
- all non-public routes require auth

Special behavior:

- OWNER can impersonate another user via cookie-based impersonation flow
- middleware clears stale cookies on `/login` to avoid redirect loops
- upload routes bypass middleware `auth()` body handling to avoid multipart corruption

## 5.2 RBAC and Access Enforcement

Roles in schema:

1. `OWNER`
2. `GM`
3. `BDC`
4. `INVENTORY`
5. `RUNNER`
6. `DETAILER`
7. `PHOTOGRAPHER`
8. `ADMIN_TITLE`
9. `READONLY`

Permission families include:

- vehicle
- customer
- appointment
- recon
- photo
- title
- location
- key
- task
- reports
- finance
- admin
- communications
- leads
- diagnostics
- service
- sold
- deposit
- reimbursement
- vendor
- accounting
- payroll

Important practical access rules:

- `finance:view` is limited to OWNER and GM
- many screens are visible to broader roles but finance fields are stripped server-side
- some route restrictions are enforced in middleware in addition to per-endpoint permission checks
- service bay is effectively owner-only
- automations are owner/gm only

## 5.3 Vehicle and Lifecycle Domain

Vehicle is the operational center of the system.

Important enums:

- `VehicleStage`
- `VehicleHealth`
- `VehicleLifecycle`

Operational stage model includes states such as:

- acquired
- intake needed
- diagnosed
- awaiting approval
- awaiting parts
- in shop
- service complete
- detail needed
- photo needed
- listing ready
- live
- hold / deposit hold
- sold pending
- delivered
- title pending
- closed
- exit wholesale

This stage model powers most downstream routing and automation.

## 5.4 Customer / Lead / Communication Domain

Capabilities:

- customer records
- lead ownership
- communication history
- appointment linkage
- appraisal linkage
- sold-deal linkage
- SMS consent state
- duplicate detection/merge
- call, text, voicemail, note history

This domain bridges public lead capture and internal office workflow.

## 5.5 Recon Domain

Core objects:

- `ReconJob`
- `ReconIssue`
- vendor associations
- cost estimates and actuals
- suggested actions
- approval decisions
- timeline and scorecard APIs

This domain drives vehicle readiness and cost control.

## 5.6 Detailing and Photo Domain

Core objects:

- `DetailJob`
- detail steps
- `PhotoJob`
- photo uploads
- problem alerts
- quality checks
- reports

This domain turns service-complete inventory into merchandisable inventory.

## 5.7 Location and Key Control Domain

Core objects:

- vehicle location
- location history
- key issuance / return records
- frontline / showcase / missing / ready-for-appointment flags

This domain controls physical dealership logistics.

## 5.8 Title, Sold, Deposit, and Compliance Domain

Core objects:

- `TitleRecord`
- `SoldDeal`
- `Deposit`
- document uploads
- notice forms
- review completion

This domain covers deal closing and legal/compliance follow-through.

## 5.9 Accounting / Payroll / Tax Domain

Core objects:

- `Account`
- `JournalEntry`
- `Bill`
- `RecurringExpense`
- `PayrollRun`
- `Contractor`

Capabilities:

- chart of accounts
- posting and reconciliation
- recurring expense posting
- payroll calculations and approvals
- tax calendar and form generation
- QuickBooks connectivity

This is unusually deep for a dealership ops app and is more like an embedded accounting subsystem.

## 5.10 Diagnostics / OBD / Flash / Tuning Domain

Files under:

- `src/lib/diagnostics`
- `src/lib/obd`
- `src/lib/flash`
- `src/lib/tuning`
- `service-bay` UI and routes

Capabilities:

- OBD bridge
- DTC lookup
- readiness monitors
- ECU profile lookup
- tuning profile handling
- flash-session logic

This is a specialized automotive diagnostics subsystem.

## 5.11 Dispatch / Vendor Travel Domain

Files under `src/lib/dispatch`.

Capabilities:

- daily plan generation
- assignment engine
- vendor scoring
- travel forecasts
- employee schedule handling

This appears to support runner/vendor movement planning and operational routing.

## 5.12 Automation / Enforcement Domain

Files:

- `src/lib/compliance/*`
- `src/lib/enforcement/*`
- `src/lib/optimization/*`
- `src/app/api/automations/*`
- webhook routes

Capabilities:

- rule-based automation
- daily accountability digests
- evidence-quality checks
- morning gate computations
- override flags
- review queues
- optimization feedback loops

The system is intentionally opinionated and enforcement-heavy.

## 6. Public and Integration API Segments

## 6.1 Public APIs

Public APIs are intentionally exposed for website and shopper flows:

- public vehicle listing/detail/search/history/suggestions
- public leads
- public appointments
- public appraise
- public hold
- public sold
- public analytics session/events
- public VIN decode
- public delivery estimate

## 6.2 Communication and Calling APIs

There is substantial Twilio and communication support:

- call token / hold / mute / hangup / transfer / disposition
- active calls
- SMS send/history/status
- call settings
- recordings
- communication templates
- Twilio webhook ingestion

This supports both customer comms and internal call handling.

## 6.3 External Integrations

Observed integrations in code:

- Twilio
- Google APIs / Gmail / Workspace admin
- Google Chat notifications
- QuickBooks
- AutoCheck
- Carfax value lookup
- KBB lookup
- Craigslist scan
- Facebook / Google / AutoTrader / CarGurus inventory feeds

## 6.4 Webhook Layer

Webhook routes are a major backend segment.

Examples:

- Twilio voice/SMS/call-state webhooks
- daily summary webhooks
- enforcement webhooks
- optimization webhooks
- send-reports webhook
- QuickBooks webhook

These support event-driven integrations and automation.

## 7. Access Model

## 7.1 Role Summary

- `OWNER`: full control, pricing, finance, users, settings, impersonation
- `GM`: broad operational control, approvals, finance visibility, automations access
- `BDC`: front-office / customer / appointment / many ops actions, but not finance visibility
- `INVENTORY`: inventory/recon/location/key execution
- `RUNNER`: location/key/vehicle movement execution
- `DETAILER`: detailing execution
- `PHOTOGRAPHER`: photo execution
- `ADMIN_TITLE`: title/back-office support with narrower permissions than owner/gm
- `READONLY`: read-oriented access to dashboards and selected modules

## 7.2 How Access Differs Between Users

Access differs by:

- route visibility
- sidebar visibility
- endpoint permission checks
- record filtering
- field-level redaction
- special-case route restrictions

Concrete examples:

- finance numbers on vehicles are hidden unless user has `finance:view`
- reimbursements are filtered by role and submitter
- service bay is restricted to OWNER
- automations route is restricted to OWNER/GM
- owner can impersonate another user and effectively see the app as that user

## 7.3 Session and Security Notes

- session auth is required for all non-public routes
- public paths are explicitly allowlisted in middleware
- stale cookie clearing reduces auth loop failure cases
- CSP and security headers are set in middleware
- login attempts are rate limited

## 8. Legacy App Spec

## 8.1 Legacy Frontend

The legacy React app in `frontend/` defines 21 page components:

- dashboard
- vehicle list/detail
- intake
- recon
- parts
- detail
- photos
- location
- keys
- titles
- aging/pricing
- appointments
- sold
- complaints
- tasks
- approvals
- users
- audit
- notifications
- login

This older app maps closely to the historical ops-hub concept.

## 8.2 Legacy Backend

The legacy Express backend mounts 20 route modules:

- auth
- users
- vehicles
- locations
- keys
- intake
- recon
- parts
- detail
- photos
- listing
- titles
- sold
- complaints
- tasks
- approvals
- appointments
- audit
- dashboard
- notifications

This backend is a narrower predecessor to the much larger Next.js API surface.

## 9. Practical Reading Guidance For An LLM

If an LLM needs to reason about this system correctly:

1. Treat the root `src/app` + `src/lib` + `prisma` as the current main product.
2. Treat `frontend/` and `backend/` as legacy reference implementations, not the primary architecture.
3. Center understanding around the `Vehicle` entity and its stage progression.
4. Model the app as five major planes:
   - public sales website
   - internal ops dashboard
   - internal APIs/workflows
   - communications/integration layer
   - accounting/advanced specialty modules
5. Assume RBAC is enforced both in navigation and in server endpoints.
6. Assume OWNER and GM have substantially more authority than operational staff.
7. Remember that some modules are operationally coupled:
   - intake -> recon -> detail -> photo -> listing/live
   - customer -> lead -> appointment -> sold
   - vehicle -> title -> deposit -> sold -> compliance

## 10. Bottom-Line Product Definition

F&F Ops Hub is a dealership operating system with four overlapping product surfaces:

- a public dealership website
- an internal role-based operations dashboard
- a workflow automation and communications backend
- a specialized automotive/financial tooling layer that includes appraisal intelligence, accounting, diagnostics, and service-bay logic

The repo is best understood as a current Next.js monolith that absorbed and expanded an older React/Express ops platform.
