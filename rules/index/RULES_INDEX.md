[RULE INDEX — SELECT WHAT TO READ]

Read this FIRST.
Then load ONLY the relevant rule file.

--------------------------------------------------

IF YOU ARE DOING DATABASE WORK:
- Schema changes, tables, relationships → READ: DB_RULES.md
- SQLAlchemy queries or performance tuning → READ: DB_RULES.md + MEMORY_PERFORMANCE_RULES.md

--------------------------------------------------

IF YOU ARE MODIFYING API / ROUTERS:
- Adding endpoint → READ: DATA_API_RULES.md
- Changing response format → READ: DATA_API_RULES.md
- Fixing error handling → READ: DATA_API_RULES.md

--------------------------------------------------

IF YOU ARE WRITING BUSINESS LOGIC:
- Validations, workflows → READ: SERVICE_LAYER_RULES.md

--------------------------------------------------

IF YOU ARE TOUCHING DATA ACCESS:
- SQLAlchemy, AsyncSession, queries → READ: REPOSITORY_RULES.md
- Performance issues → ALSO READ: MEMORY_PERFORMANCE_RULES.md

--------------------------------------------------

IF YOU ARE WORKING ON CODE STRUCTURE:
- ABCs, Depends(), class design → READ: CODING_STANDARDS_RULES.md

--------------------------------------------------

IF YOU ARE WORKING ON LOGGING:
- Adding/modifying logs → READ: LOGGING_RULES.md

--------------------------------------------------

IF YOU ARE WORKING ON PERFORMANCE OR MEMORY:
- Memory usage, optimization → READ: MEMORY_PERFORMANCE_RULES.md

--------------------------------------------------

IF YOU ARE MODIFYING ARCHITECTURE:
- New service, boundaries → READ: MICROSERVICE_ARCH_RULES.md

--------------------------------------------------

IF YOU ARE WORKING ON UI:
- Components, styling, API calls, forms → READ: UI_RULES.md

--------------------------------------------------

IF YOU ARE WRITING OR MODIFYING TESTS:
- Unit or integration tests → READ: TESTING_RULES.md

--------------------------------------------------

IF YOU ARE WORKING ON ANYTHING SECURITY-RELATED:
- Auth, secrets, headers, CORS, rate limiting, input validation, containers → READ: SECURITY_RULES.md

--------------------------------------------------

IF YOU ARE ABOUT TO PUSH CODE:
- Pre-push validation → READ: DEPLOYMENT_PRECHECK_RULES.md

--------------------------------------------------

IF YOU ARE WORKING ON CI/CD OR DEPLOYMENT:
- Pipelines, environments → READ: DEPLOYMENT_PIPELINE_RULES.md

--------------------------------------------------

ALWAYS ALSO FOLLOW:
- GLOBAL_RULES.md
- SECURITY_RULES.md

--------------------------------------------------

RULE PRIORITY (IF CONFLICT):
1) GLOBAL_RULES.md
2) Task-specific rule file
3) MEMORY_PERFORMANCE_RULES.md (for performance issues)

--------------------------------------------------

IF UNSURE:
- Do NOT invent patterns
- Follow existing codebase patterns
