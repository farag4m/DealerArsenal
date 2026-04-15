[TESTING CONTRACT — HARD RULES]

GENERAL
- Every new feature MUST have tests
- No untested business logic allowed

TEST TYPES
- Unit tests → required for services (pytest)
- Integration tests → required for API endpoints (pytest + httpx AsyncClient)
- E2E tests → required for critical UI flows (Playwright)

NAMING
- Format:
  test_{method_or_operation}_{state_or_condition}_{expected_result}

Example:
  test_create_user_invalid_email_raises_domain_exception
  test_get_user_not_found_returns_404

STRUCTURE (ARRANGE / ACT / ASSERT)
- Must be clearly separated
- No mixed logic

UNIT TEST RULES
- Test ONLY the service layer
- Mock all dependencies (repositories, external HTTP via respx)
- No real DB calls
- Use pytest fixtures for common setup

INTEGRATION TEST RULES
- Test full request → response flow via FastAPI TestClient or httpx AsyncClient
- Use SQLite (aiosqlite) or test PostgreSQL DB
- Validate:
  - response format (ApiResponse shape)
  - HTTP status codes
  - data correctness

ASSERTIONS
- Must be explicit
- No vague asserts (e.g., "not None" alone is not sufficient)

COVERAGE
- Must cover:
  - success cases
  - failure / error cases
  - edge cases

FORBIDDEN
- No testing routers with embedded business logic
- No testing SQLAlchemy queries directly unless it is an integration test
- No shared mutable state between tests (use fixtures with function scope)

DATA
- Use isolated test data per test
- No reliance on existing DB state
- Use factories or fixtures to create test data

ASYNC
- All async test functions must use @pytest.mark.asyncio
- All async calls must be awaited

FAILURE
- Tests must fail if behavior is incorrect
- No silent passes (no bare except or broad try/except in tests)

TOOLS
- Backend: pytest + pytest-asyncio + pytest-cov + respx
- Frontend: Playwright (TypeScript config — playwright.config.ts)

TYPING IN TESTS
- Backend: all test functions must have type annotations
- Frontend: all Playwright tests must be .ts files — no .js test files
- Test fixtures must be typed
- Mock/stub return values must match the real type signatures
