[MICROSERVICE CONTRACT — HARD RULES]

ARCHITECTURE INTENT
- Services are independently deployable functional modules
- They are not intended to be fully autonomous apps with separate databases
- Shared DataAPI and a central database are intentional platform decisions
- Service independence is defined at the application, UI, routing, and deployment layers

BOUNDARIES
- Each service owns its data
- Each service owns its backend and its UI
- No direct DB sharing between services
- No service knows database structure directly
- Services integrate with data only through DataAPI

COMMUNICATION
- API → HTTP only (via httpx)
- Async messaging for events (Celery/Dramatiq if used)

COUPLING
- Services must be independent
- No shared internal models

STRUCTURE
- Each service:
  - Router (FastAPI APIRouter)
  - UI/app served by that service
  - Service layer
  - DataAPI client/gateway for all data operations
  - No direct DB access layer inside the service

UI OWNERSHIP
- A microservice must house and serve its own UI
- The Control Center/web app is not the place to embed or recreate a service UI
- The Control Center may show a card, tile, or entry point for a service
- That card must redirect the user to the microservice's own path/URL/UI
- Service-specific screens, flows, and frontend state must live with the microservice that owns them
- Each service must also be directly accessible without going through the Control Center

DEPLOYMENT
- Services must be deployable independently via Docker
- UI and backend for a service should be deployable together with that service

SHARED CODE
- Shared/* may contain only infrastructure and cross-cutting primitives
- Allowed examples: auth helpers, logging contracts, correlation utilities, HTTP client helpers, config primitives, base DTO utilities
- Shared/* must not contain service-specific business rules, service-layer logic, repositories, or domain workflows
- A change to one service's domain behavior must not require another service to change unless the public contract changed

FORBIDDEN
- Cross-service DB joins
- Shared SQLAlchemy Session across services
- Tight coupling via shared internal models
- Building service-specific UI screens inside the Control Center/web app
- Putting business/domain logic into Shared/*
