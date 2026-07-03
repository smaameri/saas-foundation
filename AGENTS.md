<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data.
Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Application Overview
- Built on Next.js (custom fork behavior noted above) with Prisma for data access.
- Better Auth provides authentication; its generated Prisma models manage users, sessions, and related entities.
- React Hook Form handles form state; Zod schemas validate inputs on both client and server.
- ShadCN supplies reusable UI primitives.

## Conventions
- Use the `@/…` path alias for imports (supports files in `src` and project-level scripts). The alias resolves to the `src` directory via `baseUrl`/`paths` in `tsconfig.json`—prefer it over deep relative paths.
- Prefer using full names for variable names, e.g organizationId instead of orgId.

## Project Structure

### `src/api/` — Frontend API client layer
Scoped by portal (e.g. `src/api/admin/`). Each domain has an `*Api.ts` file that exports a typed object calling `apiClient` (from `src/api/client.ts`). Types live in `src/api/types/`. The API client returns typed promises; all data flows through these service files — never call `fetch` directly from components.

### `src/app/api/` — Route handlers (server)
Route handlers are organized to mirror the frontend API paths (e.g. `src/app/api/admin/users/route.ts`). All admin routes are wrapped with `withAdmin()` (from `src/app/api/admin/with-admin.ts`), which handles session and portal auth. `withAdmin` composes `withErrorHandler` so `ZodError` thrown anywhere in the handler is automatically returned as a 400.

Query param parsing uses `parseQuery(request, schema)` from `src/lib/api.ts` instead of manually constructing `URLSearchParams`.

### `src/app/api/admin/*/schema.ts` — Shared Zod schemas
Schemas live alongside their route handler and are imported by both the route (for server-side validation) and the frontend API service (for type inference). This is the single source of truth for input shapes.

### `src/serializers/` — Data transformation
Each domain has a `*Serializer.ts` file that maps Prisma entities to API DTOs (e.g. `serializeUser`, `serializeApiKey`). Serializers handle date serialization (`Date` → ISO string), field renaming, and computed relations. Route handlers never return raw Prisma objects.

### `src/repositories/` — Data access
Repository functions wrap Prisma queries. They accept loosely-typed params (e.g. `sort?: string`, `order?: SortOrder`) since validation happens upstream in the schema layer. Shared types (e.g. `SortOrder`) live in `src/repositories/types.ts`.

### `src/validators/` — Complex server-side validation
For validation that requires database lookups (e.g. checking an invitation exists before cancelling), use a class extending `BaseValidator<T>`. Simple shape validation uses Zod schemas directly.

### Request lifecycle
```
Component → *Api.ts (apiClient) → route.ts (withAdmin → withErrorHandler)
  → parseQuery/body.parse → Validator (if needed) → Repository → Serializer → Response
```
