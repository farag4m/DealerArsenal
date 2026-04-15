[LOGGING CONTRACT — HARD RULES]

PURPOSE
- Logging must be:
  - structured (JSON via structlog)
  - minimal
  - meaningful
- Logs are for debugging + observability, NOT noise

--------------------------------------------------

WHERE TO LOG

ROUTERS
- DO NOT log
- Logging handled by global exception handlers

SERVICES
- MUST log:
  - start/end of important operations
  - business-relevant events
  - validation failures

REPOSITORIES
- DO NOT log normal operations
- ONLY log:
  - DB failures
  - unexpected query issues

MIDDLEWARE / EXCEPTION HANDLERS
- MUST log:
  - all exceptions
  - request failures

INFRASTRUCTURE (external APIs, files, messaging)
- MUST log:
  - outgoing requests
  - failures
  - retries

--------------------------------------------------

LOG LEVELS

INFO
- Normal operations
- Successful flows

WARNING
- Unexpected but handled situations
- Validation issues
- Retries

ERROR
- Exceptions
- Failed operations

CRITICAL RULE
- Do NOT misuse levels
- Do NOT log everything as ERROR

--------------------------------------------------

STRUCTURED LOGGING (MANDATORY)

- ALL logs via structlog — NEVER use print() or bare logging.info()
- NEVER use string concatenation in log messages
- Use structured key-value pairs:
  logger.info("event_name", key=value, key2=value2)

REQUIRED FIELDS (when applicable)
- operation (name of operation)
- entity_id / user_id / correlation_id
- outcome (success / failure)
- reason (if failure)

EXAMPLE
  logger.info("create_user", outcome="success", user_id=123)
  logger.warning("create_user", outcome="failure", reason="invalid_email")

--------------------------------------------------

SENSITIVE DATA

FORBIDDEN TO LOG:
- passwords
- tokens / JWTs
- personal identifiable info (PII)
- full objects containing sensitive fields

--------------------------------------------------

DUPLICATION

- Each error MUST be logged ONCE
- No duplicate logs across layers

FLOW:
- Exception occurs → logged in exception handler
- Service should NOT log same exception again

--------------------------------------------------

PERFORMANCE

- Logging must NOT:
  - serialize entire SQLAlchemy model objects
  - allocate large structures per request
- Avoid heavy logging inside loops

--------------------------------------------------

CORRELATION

- All logs must include correlation_id (bound via structlog.contextvars)
- CorrelationIdMiddleware binds it automatically per request
- Enables tracing across services

--------------------------------------------------

FORBIDDEN

- print()
- logging.basicConfig() plain text logging
- Logging inside tight loops
- Logging full SQLAlchemy model objects
- Logging same event multiple times across layers
