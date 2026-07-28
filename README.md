# SaaS Foundation

A Next.js starter for building B2B SaaS products, with auth, a database, forms, and a component library all wired up out of the box.

> [!NOTE]
> **Pre-release:** SaaS Foundation is still in pre-release mode, and more comprehensive setup documentation is coming soon.
>
> That said, the Getting Started commands below should do the job, do feel free to try it out in the meantime, and
> If you get stuck or have any questions, shoot me an email on [ssmaameri@gmail.com](mailto:ssmaameri@gmail.com).

## Prerequisites

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/installation)
- [Docker](https://docs.docker.com/get-docker/), with Docker running

## Getting Started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Set up the environment, auth secret, database, admin account, and optional demo data:

   ```bash
   pnpm app:setup
   ```

3. Start the development server:

   ```bash
   pnpm dev
   ```

### Manual Setup

To run each setup step yourself:

```bash
cp .env.example .env
docker compose up -d
npx prisma migrate dev
pnpm admin:create
pnpm seed
pnpm dev
```

## Tech Stack

- **[Next.js](https://nextjs.org)** — React framework for the web app
- **[Prisma](https://www.prisma.io)** — ORM for database access and migrations
- **[PostgreSQL](https://www.postgresql.org)** — Database, run locally via Docker
- **[Better Auth](https://better-auth.com)** — Authentication library, also generates the user/session Prisma schema
- **[ShadCN](https://ui.shadcn.com)** — Component and design library
- **[Zod](https://zod.dev)** — Schema validation
- **[React Hook Form](https://react-hook-form.com)** — Form state management
