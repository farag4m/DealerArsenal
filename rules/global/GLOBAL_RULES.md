[GLOBAL CONTRACT — NON-NEGOTIABLE]

- No duplicated logic anywhere
- No skipping layers
- No mixing responsibilities
- No direct DB access outside DataAPI (no AsyncSession in service backends)
- No UI component calling API directly — always through the API client layer

STRICT DATA FLOW:
React UI → FastAPI Service Backend → DataAPI (FastAPI) → Database

EVERYTHING MUST BE:
- Reusable
- Testable
- Replaceable

--------------------------------------------------

TYPES ARE MANDATORY — NO EXCEPTIONS

PYTHON
- Every function parameter and return type must be annotated
- Every class attribute must be typed (Mapped[T] for SQLAlchemy, plain annotations for services/schemas)
- Pydantic models must annotate every field
- pyright (strict) must pass with zero errors

TYPESCRIPT
- TypeScript strict mode MUST be on at all times
- Every prop, function parameter, and return value must be typed
- No any — use unknown + narrowing or define the correct type
- Zod is the runtime validation layer — derive TS types from Zod schemas
- tsc --noEmit must pass with zero errors before every build

THE RULE:
If a type is missing, the code is not finished. Types are not optional.

--------------------------------------------------

IF UNSURE:
- Follow existing patterns in codebase
- DO NOT introduce new patterns without discussion
