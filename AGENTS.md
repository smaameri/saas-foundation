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
