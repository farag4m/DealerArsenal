[UI CONTRACT — HARD RULES]

LANGUAGE
- TypeScript ONLY — no .js or .jsx files
- All files must be .ts or .tsx
- tsconfig.json must have "strict": true at all times

--------------------------------------------------

TYPING — MANDATORY (TYPESCRIPT)

- ALL props must have explicit TypeScript interfaces or types
- NEVER use any — use unknown and narrow, or define a proper type
- ALL function parameters and return types must be explicitly typed
- ALL API response shapes must be typed via the ApiResponse<T> generic
- Zod schemas are the single source of truth for runtime-validated shapes
  — derive TypeScript types from Zod: type User = z.infer<typeof UserSchema>
- No implicit any via tsconfig — "noImplicitAny": true enforced via strict mode
- "noUncheckedIndexedAccess": true — always check array/object access results
- Component props: always define an explicit Props interface or type alias
- Event handlers: always type the event parameter explicitly
  e.g. (e: React.ChangeEvent<HTMLInputElement>) => void
- useQuery / useMutation must be typed: useQuery<ApiResponse<User>>
- NEVER suppress TypeScript errors with @ts-ignore or @ts-expect-error
  unless accompanied by a comment explaining why

FORBIDDEN (TYPING)
- any type without explicit justification
- Untyped props (no implicit {})
- Casting with as T to silence type errors — fix the type instead
- Omitting return types on non-trivial functions

--------------------------------------------------

COMPONENTS
- Everything must be reusable
- If duplicated → MUST be extracted into a shared component

NO DUPLICATION
- No repeated JSX blocks
- No repeated Tailwind class patterns (extract to component or clsx helper)

STATE
- No duplicated state
- Server state via TanStack Query (useQuery / useMutation)
- Local UI state via useState / useReducer
- No prop drilling > 2 levels — use context or co-location

API CALLS
- ALL API calls must go through the centralized axios client (src/api/client.ts)
- NO direct fetch() or axios calls inside components
- API functions live in src/api/ — imported by typed query hooks
- All API functions must be typed end-to-end: input params + ApiResponse<T> return

DATA
- UI consumes Pydantic response shapes (ApiResponse.data) ONLY
- No transformation logic inside components
- Zod schemas validate API response shapes at the boundary
- Derive TypeScript types from Zod schemas — do not duplicate type definitions

STYLING
- Tailwind CSS ONLY — no inline styles unless truly dynamic
- No mixing Tailwind with other CSS frameworks
- Use clsx for conditional class composition

FORMS
- All forms use react-hook-form
- Validation via zod resolver
- No manual form state management
- Schema types flow directly into form field types

NAMING
- Components: PascalCase
- Props interfaces: PascalCase suffixed with Props (e.g. UserCardProps)
- Files: PascalCase for components (UserCard.tsx), kebab-case for pages (user-detail.tsx)
- Custom hooks: camelCase prefixed with use (e.g. useUserList)

FORBIDDEN
- Business logic in UI components
- Hardcoded values (use constants or typed config)
- Deep prop drilling (>2 levels)
- Direct DB or API access bypassing the client layer
- .js / .jsx files
- any type

PERFORMANCE
- Memoize with useMemo / useCallback when computationally expensive
- Lazy load heavy components via React.lazy + Suspense
- Use TanStack Query caching — do not refetch unnecessarily
