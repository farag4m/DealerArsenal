[CODING STANDARDS CONTRACT — HARD RULES]

GENERAL STRUCTURE
- One class/module per responsibility
- File name MUST reflect its contents (snake_case)
- No deeply nested classes unless required

NAMING (PEP 8 STRICT)
- Classes: PascalCase
- Functions / methods: snake_case
- Variables: snake_case
- Private attributes: _snake_case
- Constants: UPPER_CASE
- Pydantic schemas: PascalCase (e.g. UserResponse, CreateUserRequest)

--------------------------------------------------

TYPING — MANDATORY (PYTHON)

- ALL function signatures MUST have type annotations (parameters + return type)
- ALL class attributes MUST have type annotations
- NEVER use Any unless unavoidable and explicitly justified with a comment
- Use | None instead of Optional[T] (Python 3.10+ union syntax)
- Use list[T], dict[K, V], tuple[T, ...] — NOT List, Dict, Tuple from typing
- Use TYPE_CHECKING guard for import-only types:
    from __future__ import annotations  # top of file
- Pydantic models must annotate every field
- SQLAlchemy models must use Mapped[T] for all columns:
    id: Mapped[int] = mapped_column(primary_key=True)
- Return types MUST be explicit — never omit them
- pyright (strict) or mypy (strict) MUST pass with zero errors

FORBIDDEN (TYPING)
- Untyped function parameters or return values
- Bare `Any` without justification
- Implicit Optional (e.g. def f(x=None) without x: T | None)
- Skipping type annotations "to save time"

--------------------------------------------------

ABSTRACTIONS — DECISION RULE (MANDATORY)

USE AN ABSTRACT BASE CLASS / PROTOCOL IF:
- The class is injected via FastAPI Depends() AND:
  - It contains business logic (services)
  - It abstracts data access (repositories)
  - It calls external systems (APIs, file system, messaging)

DO NOT USE AN ABSTRACT BASE CLASS IF:
- The class is:
  - Pydantic schema (DTO)
  - SQLAlchemy model (entity)
  - Internal helper used in only ONE place
  - Pure data container
  - Static utility function

MULTIPLE IMPLEMENTATIONS RULE
- If multiple implementations are EXPECTED → ABC/Protocol REQUIRED
- If only one implementation exists:
  - STILL use ABC for services/repositories
  - DO NOT for simple helpers

STRICT RULE
- No abstraction without purpose
- No implementation without ABC (for services/repositories)

NAMING
- Abstract: UserServiceBase or UserServiceProtocol
- Implementation: UserService

--------------------------------------------------

DEPENDENCY INJECTION

- Use FastAPI Depends() for all injected dependencies
- No manual instantiation of services/repositories
- No global mutable state

RULES
- Dependencies MUST be injected via Depends()
- NEVER instantiate service/repository classes manually inside route handlers

LIFETIMES
- Request-scoped → services, repositories, AsyncSession
- Singleton → stateless utilities, config, http clients
- Avoid module-level mutable state

FORBIDDEN
- Instantiating AsyncSession directly in routes
- Using module-level singletons for request-scoped logic

--------------------------------------------------

CLASS DESIGN

SINGLE RESPONSIBILITY
- One class = one responsibility
- If class handles multiple concerns → split

METHOD SIZE
- Keep methods small and focused
- Max ~30 lines

PARAMETERS
- Max 3–4 parameters
- Otherwise use a Pydantic request schema

--------------------------------------------------

ABSTRACTION LAYERS

STRICT FLOW:
Router → Service → Repository → DB

FORBIDDEN
- Router → Repository
- Service → Router
- Repository → Service

--------------------------------------------------

STATIC USAGE

ALLOWED
- Pure, stateless utility functions (helpers, formatters)

FORBIDDEN
- Business logic
- Anything requiring DI
- Holding mutable state

--------------------------------------------------

ERROR HANDLING

- Raise DomainException for business rule violations
- Global exception handlers catch and format all errors
- NEVER catch exceptions silently

FORBIDDEN
- Silent except blocks
- Empty except clauses
- Swallowing exceptions with `pass`

--------------------------------------------------

NULL / NONE HANDLING

- Use Optional[T] / T | None explicitly
- Do not hide None with chained attribute access
- Check for None explicitly

--------------------------------------------------

ENUMS

- Use Python Enum/StrEnum instead of magic strings/numbers

--------------------------------------------------

COMMENTS

- No obvious comments
- Only for complex or non-obvious logic

--------------------------------------------------

FORBIDDEN

- God classes / god modules
- Deep inheritance (>2 levels)
- Circular imports
- Magic strings / magic numbers
- Copy-paste logic
