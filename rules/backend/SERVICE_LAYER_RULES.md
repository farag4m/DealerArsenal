[SERVICE CONTRACT — HARD RULES]

RESPONSIBILITY
- Contains ALL business logic
- No DB logic beyond repository calls

STRUCTURE
- Each domain entity MUST have a service
- Services must be injected via FastAPI Depends()

REUSE
- No duplicated logic
- Shared logic MUST be extracted into helper functions or base services

TRANSACTIONS
- Must be explicit when multiple writes occur (wrap in a single AsyncSession commit)
- No hidden side effects across unrelated repositories

INPUT/OUTPUT
- Input: Pydantic request schema or primitive values
- Output: Pydantic response schema ONLY (never SQLAlchemy model)

ERROR HANDLING
- Raise DomainException for business rule violations
- DO NOT format HTTP responses here — that is the router's job via ApiResponse

FORBIDDEN
- Accessing AsyncSession directly (go through repository)
- Calling router logic or returning HTTP responses
- Returning SQLAlchemy model instances
