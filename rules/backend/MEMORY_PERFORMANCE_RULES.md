[MEMORY & PERFORMANCE CONTRACT — HARD RULES]

RESOURCE MANAGEMENT
- ALWAYS use async context managers for resources:
  - AsyncSession (via async with or Depends())
  - httpx.AsyncClient (via async with)
  - file handlers (via async with aiofiles.open())
- NEVER leave async resources unclosed

ALLOCATION
- Avoid unnecessary object creation inside loops
- Reuse objects (e.g. httpx.AsyncClient) when possible — do not re-create per request

REFLECTION / DYNAMIC INVOCATION
- Avoid Python reflection (getattr with dynamic names) in hot paths
- No eval() or exec() in request paths
- Cache results of expensive introspection if needed

SQLALCHEMY PERFORMANCE
- No large ORM object graphs loaded into memory
- Use projection (select specific columns) instead of loading full rows
- No tracking when doing read-only queries (use execution options or plain select)
- Use selectinload / joinedload for relationships — never rely on lazy loading

ASYNC
- ALL I/O must be async (DB, HTTP, file)
- No sync-over-async (no asyncio.run() inside async context)
- No blocking calls (no time.sleep, no requests library in async code)

COLLECTIONS
- Avoid large in-memory lists
- Use pagination (offset + limit) ALWAYS for list queries
- Stream large datasets if needed — do not buffer full result sets

STRINGS / OBJECTS
- Avoid excessive string concatenation in loops → use join() or f-strings
- Do not construct large response objects unnecessarily

CACHING
- Cache expensive computations using Redis when safe
- Do NOT cache AsyncSession or request-scoped dependencies
- Cache at service layer, not repository layer

HTTP CLIENTS
- Use a single shared httpx.AsyncClient per service (lifespan context)
- Do NOT create a new AsyncClient per request

FORBIDDEN
- Memory leaks via module-level mutable state
- Long-lived large objects in request scope
- Circular references in Pydantic schemas
- Blocking I/O in async route handlers
