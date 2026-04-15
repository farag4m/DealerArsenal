# DMS AI Handoff (Updated with Logging)

## Core Architecture
- .NET 8 (ASP.NET Core)
- Central DataAPI (only DB access layer)
- Independent microservices (no direct DB access)
- Services are independently deployable functional modules, not separate full apps with their own databases
- Each microservice owns and serves its own UI
- Control Center UI only lists services and routes users into them
- Each microservice must also be reachable directly without Control Center
- Central database per customer

---

## Logging (MANDATORY DESIGN)

### Goals
- Trace every request across services
- Debug service setup + DB operations
- Audit critical actions (service enable/disable)

### Stack
- Serilog
- Structured logging (JSON)
- Correlation IDs per request

### Hard Rules
1. EVERY request MUST have a CorrelationId
2. ALL logs MUST be structured (no plain text logs)
3. NO silent failures — all exceptions must be logged
4. NEVER log sensitive data (passwords, tokens, PII)
5. ALL service setup steps MUST log start + success + failure
6. DataAPI MUST log every DB query execution (at debug level)
7. Control Center MUST log user actions (Add Service, Open Service)

### UI Ownership (MANDATORY DESIGN)
- Every microservice must house its own UI alongside its service logic
- The Control Center/web app must not implement service-specific pages or duplicate a microservice UI
- The Control Center should expose a card or launcher for each microservice
- Selecting that card must redirect the user to the microservice's own path/URL/UI
- Service workflows, screens, and frontend behavior belong inside the owning microservice

---

## Logging Levels
- Information: normal operations
- Warning: recoverable issues
- Error: failures
- Debug: DB queries, internal steps

---

## Example Log (JSON)
{
  "Timestamp": "...",
  "Level": "Information",
  "CorrelationId": "abc-123",
  "Service": "DataAPI",
  "Action": "SetupService",
  "Message": "Executing setup step 2"
}

---

## Database Design
- Normalization: 3NF
- No duplicated data
- All relationships via IDs

---

## Hard Design Rules
- DataAPI is ONLY DB access
- No service talks to DB directly
- Each service owns its own UI and backend
- Control Center is a launcher, not the host for microservice UIs
- Direct service URLs must work without requiring navigation through Control Center
- Central DB + DataAPI are intentional and do not remove service independence at the application layer
- All schemas created via setup steps
- Setup steps must be idempotent
- No hardcoded DB logic
- Everything config-driven
- Shared/* is for infrastructure primitives only, never domain/business logic

---

## Service Setup Flow
1. Request setup
2. Validate service
3. Fetch setup plan
4. Execute ordered steps
5. Log each step
6. Mark service enabled

---

## Project Structure
- ControlCenter.Web
- DataAPI
- Services/*
- Shared/*

### ControlCenter.Web Responsibility
- Show available services
- Render cards/links for each service
- Redirect users to the correct microservice URL/path
- Do not host service-specific workflows or service-specific screens

### Services/* Responsibility
- Own service-specific API logic
- Own service-specific UI
- Serve or host the frontend for that service independently of ControlCenter.Web
- Remain directly reachable by URL even when ControlCenter.Web is not used

### Shared/* Responsibility
- Hold cross-cutting infrastructure helpers only
- Examples: auth, logging, correlation IDs, config primitives, transport helpers
- Must not hold service-specific business rules, repositories, or domain workflows

---

## Summary
- Architecture is modular + scalable
- DB is normalized (3NF)
- Logging is mandatory and structured
- Each microservice owns its own UI
- Control Center only redirects users into each microservice UI
- Services are directly reachable without Control Center
- Shared DataAPI + central DB are intentional platform choices
- Shared/* is limited to cross-cutting infrastructure primitives
- Designed for AI + junior devs
