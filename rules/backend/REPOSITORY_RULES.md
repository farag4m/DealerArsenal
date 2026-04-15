[REPOSITORY CONTRACT — HARD RULES]

STRUCTURE
- All repositories inherit BaseRepository[ModelT]
- No duplicated CRUD logic

BASE METHODS (MANDATORY)
- get_by_id(id) → Model | None
- get_all(offset, limit) → list[Model]
- add(instance) → Model
- delete(instance) → None

SQLALCHEMY USAGE
- AsyncSession injected via FastAPI Depends()
- No module-level or static session
- Always async queries (await session.execute(...))

QUERY RULES
- Build queries using select() + where() chaining before execution
- No premature .all() or scalars() before filters are applied

PROJECTION
- Prefer loading only needed columns when returning schemas
- Avoid loading full model rows when partial data is sufficient

TRACKING
- Read queries: do not modify fetched objects — they are not tracked for writes
- Write queries: add/modify objects within the same session, then flush

FORBIDDEN
- Business logic in repository
- Returning mixed DTO + model results
- Raw SQL unless necessary and documented
- Direct session creation inside repository methods
