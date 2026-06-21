## Route Groups Overview

- `src/app/(auth)`: public auth surfaces (login, register). Layout should never rely on an authenticated session. Redirects go to `/dashboard` after sign-in.
- `src/app/(app)`: authenticated experience. Layout fetches the Better Auth session via `fetchSession()` and redirects to `/login` when `session.session` is missing. Add new protected pages (e.g., `/dashboard`) inside this folder.
- `src/app/page.tsx`: root redirect to `/login`. Adjust if you introduce a marketing homepage.

## Session Helpers

- Use `fetchSession()` (server) and `authClient.useSession()` or `authClient.getSession()` (client) to obtain the signed-in user. They already map Better Auth’s `{ session, user }` structure.
- When guarding pages, check `session?.session` rather than the old `.data` shape.

## Common Pitfalls

- Don’t duplicate routes outside the route groups—`(app)/dashboard` already resolves to `/dashboard`.
- Keep imports using the `@/` alias; baseUrl/paths are set for the repo root.
