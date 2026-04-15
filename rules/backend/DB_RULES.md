[DB CONTRACT — HARD RULES]

NORMALIZATION
- Minimum 3NF required
- No duplicated data across tables
- Junction tables required for many-to-many
- No denormalization unless explicitly justified

TABLE STRUCTURE
- Every table MUST have:
  id (PK), created_at, updated_at
- PK type must be consistent across DB (UUID or INT, not mixed)

NAMING
- Tables: snake_case, plural (users, orders)
- Columns: snake_case
- Foreign keys: {entity_name}_id
- Index: ix_{table}_{column}
- FK constraint: fk_{from}_{to}

RELATIONS
- All relationships MUST use FK constraints
- Default delete behavior: RESTRICT (no cascade unless required)

INDEXING
- REQUIRED on:
  - All foreign keys
  - All unique fields (email, username)
  - Frequently filtered columns
- Composite indexes must match query order
- Avoid over-indexing (>5 per table requires justification)

SQLALCHEMY — MODEL RULES
- Use SQLAlchemy 2.x declarative style with mapped_column() (NO annotation shortcuts that skip explicit column definitions)
- No business logic inside model classes
- No lazy loading (use selectinload / joinedload explicitly)
- Relationships must be explicitly declared

QUERY RULES
- ALWAYS use projection (select specific columns or load into schema)
- NEVER load full model if partial data is needed
- Reads do NOT need explicit tracking control — SQLAlchemy async sessions do not auto-track by default
- NEVER call .all() or scalars() before applying filters

PERFORMANCE
- No N+1 queries — use joinedload / selectinload for relationships
- Pagination REQUIRED for all list endpoints (offset + limit)
- Use select() + where() chaining, never load-then-filter

MIGRATIONS (Alembic)
- All schema changes via Alembic migration scripts
- Migrations must be versioned and reversible (upgrade + downgrade)
- No dynamic schema changes at runtime

FORBIDDEN
- Returning SQLAlchemy model instances directly from repositories
- Raw SQL unless justified and documented
- Dynamic schema changes at runtime
- Accessing DB outside of DataAPI
