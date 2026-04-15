[DATA API CONTRACT — HARD RULES]

ROUTER RULES (STRICT)
- NO business logic
- NO try/except
- NO data access
- NO mapping logic

ALL endpoints MUST delegate to a service:

    result = await service.method(input_schema)
    return ApiResponse.ok(result)

EXCEPTION HANDLING
- Global exception handlers (registered in main.py) are the ONLY place for:
  - error handling
  - logging
  - response formatting
- No duplicate try/except anywhere else in routers

RESPONSE FORMAT (MANDATORY)
{
  "success": boolean,
  "data": object | null,
  "errors": string[],
  "meta": object | null
}

- NEVER return raw SQLAlchemy model instances
- NEVER return inconsistent response shapes
- ALL responses use ApiResponse.ok() or ApiResponse.fail()

SCHEMA RULES (Pydantic)
- SQLAlchemy models MUST NEVER be returned directly
- All responses MUST use Pydantic response schemas
- Schemas are flat (no circular refs)
- Use model_validate() to convert ORM → schema

MAPPING
- Use Pydantic model_validate(orm_obj, from_attributes=True)
- NO inline manual mapping in routers

ENDPOINT RULES
- Must follow standard CRUD naming:
  - get_by_id
  - get_all (paginated)
  - create
  - update
  - delete

VALIDATION
- Pydantic schemas handle input validation automatically
- Additional business validation happens in the service layer
- No manual validation logic inside router functions

ASYNC
- ALL route handlers must be async def
- NO blocking calls (no sync DB calls, no time.sleep)

FORBIDDEN
- Returning SQLAlchemy model objects from routers
- Raising raw exceptions from routers
- Mixing response formats
- Using JSONResponse manually except in exception handlers
