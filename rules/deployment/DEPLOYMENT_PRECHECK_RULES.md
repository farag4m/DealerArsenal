[PRE-PUSH CONTRACT — MUST PASS BEFORE COMMIT]

STEP 1 — VALIDATE RULE COMPLIANCE
- Confirm no rule violations in:
  - GLOBAL_RULES.md
  - Relevant task rule file

STEP 2 — RUN TESTS
- All pytest tests MUST pass (backend)
- All Playwright tests MUST pass (frontend)
- No skipped tests allowed

STEP 3 — VERIFY API CONTRACT
- Response format matches:
  { success, data, errors, meta }
- No raw SQLAlchemy model objects returned

STEP 4 — PERFORMANCE CHECK
- No unnecessary full-row loads where projection suffices
- No large object loading into memory
- Queries use select() + where() chaining before execution

STEP 5 — RESOURCE CHECK
- All async resources use async with (AsyncSession, httpx.AsyncClient)
- No module-level mutable request-scoped state
- No blocking I/O in async route handlers

STEP 6 — DUPLICATION CHECK
- No duplicated logic
- Shared code extracted properly (base repository, shared middleware, etc.)

STEP 7 — NAMING & STRUCTURE
- Follows PEP 8 naming conventions
- Correct layer separation (router → service → repository)

STEP 8 — LINTING & TYPES (MANDATORY — ZERO TOLERANCE)
- Python: pyright (strict) passes with ZERO errors — no suppressed type errors
- Python: ruff passes with no errors
- TypeScript: tsc --noEmit passes with ZERO errors
- TypeScript: no any types without documented justification
- Frontend: no ESLint errors
- If type checks fail → DO NOT push — fix the types

STEP 9 — COMMIT RULES
- Small, focused commit
- Clear commit message (imperative, present tense)

STEP 10 — PULL REQUEST (NEVER PUSH DIRECTLY TO MAIN)
- NEVER push to main directly — always create a Pull Request
- Push your branch, then open a PR targeting main
- PR title: short, imperative (e.g. "Add dealer inventory sync endpoint")
- PR body must include (LLM-targeted format):

  ## What changed
  One or two sentences. State what was added, modified, or removed. Be specific about files/modules touched.

  ## Why
  The business or technical reason. Reference the task, bug, or requirement driving this change.

  ## Context for reviewer
  Any non-obvious decisions, trade-offs, or gotchas the reviewer should know before reading the diff.

FORBIDDEN
- Pushing with failing tests
- Skipping validation steps
- Temporary/debug code in commit (no print() left in, no commented-out code)
- Pushing directly to main under any circumstances
