[CI/CD CONTRACT — HARD RULES]

PIPELINE STAGES (MANDATORY ORDER)

1) BUILD
- Docker images must build successfully
- No dependency installation errors
- Frontend: vite build must succeed with no errors

2) TEST
- Run ALL pytest tests (backend)
- Run ALL Playwright tests (frontend)
- ANY failure → STOP pipeline

3) VALIDATION
- Enforce code standards (ruff or flake8)
- Linting must pass
- Type checking (pyright or mypy) must pass

4) SECURITY (MANDATORY — NOT OPTIONAL)
- pip-audit MUST run and pass — any known vulnerability blocks the pipeline
- No secrets committed to repo

5) ARTIFACT BUILD
- Build Docker images with pinned tags
- Must be reproducible

6) DEPLOY (ONLY IF ALL ABOVE PASS)

--------------------------------------------------

DEPLOYMENT RULES

- Deployment is triggered by the human — never automated by any agent
- Pipeline must support deployment when the human triggers it
- Must support rollback (previous Docker image tag)
- No direct cloud edits

ENVIRONMENTS
- Local (development machine)
- Cloud (production)
- All pipeline stages must pass before cloud deployment is possible

CONFIGURATION
- No secrets in code or Docker images
- Use environment variables or secret manager (.env files NOT committed)
- Use .env.example as the template

DATABASE
- Migrations via Alembic:
  - versioned
  - reversible (upgrade + downgrade)
  - run automatically before app starts in production

ZERO-DOWNTIME
- Deployments must not break running system

--------------------------------------------------

FORBIDDEN

- Skipping tests in pipeline
- Deploying from local machine directly
- Hardcoding environment configs in code
- Manual DB edits in production
- Committing .env files with real secrets
