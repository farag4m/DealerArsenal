[SECURITY CONTRACT — HARD RULES]

--------------------------------------------------

AUTHENTICATION & AUTHORIZATION

- ALL non-public endpoints MUST require authentication
- JWT validation MUST verify: signature, expiry (exp), issuer (iss)
- Access tokens MUST be short-lived (≤15 minutes)
- Refresh tokens MUST be rotated on every use
- Tokens MUST be invalidated on logout
- Authorization MUST be enforced at the service layer — never trust the router to be the only gate
- No hardcoded credentials anywhere in code or config files

FORBIDDEN
- Accepting expired or unverified tokens
- Storing raw tokens in DB (store hashed)
- Putting auth logic only in the router

--------------------------------------------------

INPUT VALIDATION

- ALL external input MUST be validated via Pydantic schemas at the API boundary
- NEVER pass raw user input directly to DB queries — use parameterized queries only (SQLAlchemy enforces this — do not bypass it with raw SQL)
- File uploads MUST validate: MIME type, file extension, file size limit
- No user input is trusted — validate shape, type, and range

FORBIDDEN
- Raw SQL with string interpolation
- Trusting Content-Type headers alone for file validation
- Skipping Pydantic validation for any external input

--------------------------------------------------

ERROR HANDLING & INFORMATION EXPOSURE

- NEVER expose stack traces, internal paths, model names, or DB details to API callers
- External error responses MUST use generic messages only
- Detailed error context goes to logs only (via structlog, with correlation_id)
- 4xx errors MUST NOT leak which part of validation failed in detail (e.g. "invalid credentials" not "password incorrect")

FORBIDDEN
- Returning exception messages directly in API responses
- Exposing SQLAlchemy errors or Python tracebacks to clients

--------------------------------------------------

SECRETS & CONFIGURATION

- NO secrets in code, git history, Docker images, or CI logs
- ALL secrets via environment variables loaded through pydantic-settings
- .env files MUST NOT be committed — .env.example is the only committed template
- Secrets MUST be rotated immediately on suspected compromise
- No secrets passed as CLI arguments (visible in process list)

FORBIDDEN
- Hardcoded API keys, passwords, tokens, or connection strings
- Logging secret values even at DEBUG level

--------------------------------------------------

CORS

- CORS allowlist MUST be explicit — wildcard (*) is FORBIDDEN in any non-local environment
- Allowed origins defined via environment variable (not hardcoded)
- Credentials (cookies, auth headers) MUST NOT be allowed with wildcard origin

--------------------------------------------------

SECURITY HEADERS (MANDATORY on all HTTP responses)

- Strict-Transport-Security: max-age=63072000; includeSubDomains
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Content-Security-Policy: defined per service
- Referrer-Policy: no-referrer

These MUST be applied via middleware — not per-route.

--------------------------------------------------

HTTPS

- HTTPS MUST be enforced in all non-local environments
- HTTP requests MUST be redirected to HTTPS
- TLS termination handled at Nginx layer

--------------------------------------------------

RATE LIMITING

- ALL public-facing endpoints MUST have rate limiting applied
- Rate limits enforced at Nginx or middleware level
- Repeated auth failures MUST trigger progressive delays or temporary lockout

--------------------------------------------------

PASSWORD & CREDENTIAL STORAGE

- Passwords MUST be hashed with bcrypt or argon2 — NEVER stored plain or MD5/SHA1
- API keys stored as hashed values — never raw
- No credentials returned in any API response

--------------------------------------------------

DEPENDENCY SECURITY

- pip-audit MUST run on every CI build — NOT optional
- All Python dependencies MUST be pinned to exact versions in requirements.txt
- Dependencies MUST be reviewed and updated on a regular basis
- Any known vulnerability found by pip-audit MUST block the pipeline

--------------------------------------------------

CONTAINER SECURITY

- Containers MUST NOT run as root — use a non-root USER in Dockerfile
- Use minimal base images (python:3.x-slim or equivalent)
- No unnecessary packages installed in production images
- No secrets passed as ENV in Dockerfile — use runtime environment injection

--------------------------------------------------

XSS PREVENTION (Frontend)

- NEVER use dangerouslySetInnerHTML without explicit sanitization
- Content-Security-Policy header MUST be set
- All user-generated content MUST be escaped before rendering
- No inline event handlers in HTML

--------------------------------------------------

PII & DATA HANDLING

- PII fields MUST be identified and documented per model
- PII MUST NOT appear in logs (enforced by LOGGING_RULES.md)
- Sensitive fields (SSN, payment info) MUST be encrypted at rest
- Data access to PII MUST be auditable via logs

--------------------------------------------------

FORBIDDEN (GLOBAL)

- eval() or exec() anywhere in the codebase
- Wildcard CORS in non-local environments
- Plain-text password storage
- Secrets in environment variable names visible in process listings
- Skipping pip-audit in CI
- Running production containers as root
