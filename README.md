<p align="center">
  <a href="https://saasfoundation.dev">
    <img src=".github/assets/saas-foundation-mark.svg" width="104" alt="SaaS Foundation">
  </a>
</p>

<h1 align="center">SaaS Foundation</h1>

<p align="center">
  A B2B SaaS multi-tenant starter kit for TypeScript based on Next.js, Prisma and Better Auth.
</p>

<p align="center">
  <a href="https://saasfoundation.dev">Website</a> ·
  <a href="https://docs.saasfoundation.dev">Docs</a> ·
  <a href="#live-demo">Live Demo</a>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT License"></a>
</p>

## Live Demo

Try the [live demo](https://demo.saasfoundation.dev/login?email=admin%40example.test) with these credentials:

- Password: `Demo1234!`

## Prerequisites

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/installation)
- [Docker](https://docs.docker.com/get-docker/)

## Getting Started

1. Clone the repo into your own project folder. Replace `my-app` with your actual project name:

   ```bash
   git clone git@github.com:smaameri/saas-foundation.git my-app
   cd my-app
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up the environment, auth secret, database, admin account, and optional demo data:

   ```bash
   pnpm app:setup
   ```

4. Start the development server:

   ```bash
   pnpm dev
   ```

For more detail, follow the [Quickstart guide](https://docs.saasfoundation.dev/quickstart).

## Background Jobs

Inngest is configured in `src/inngest/client.ts` and served at `/api/inngest`.
Register background functions in the route handler's `functions` array when adding jobs.

For local development, set `INNGEST_DEV=1` in `.env.development.local`, run
`pnpm dev`, and start the Inngest Dev Server in another terminal:

```bash
pnpm dlx inngest-cli@latest dev -u http://localhost:3000/api/inngest
```

Open http://localhost:8288 to inspect functions and runs. No cloud keys are required locally.

For Inngest Cloud, set `INNGEST_EVENT_KEY` and `INNGEST_SIGNING_KEY` in your
deployment environment and sync `/api/inngest` in Inngest. Leave `INNGEST_DEV`
unset or set it to `0` in production.

## Next Steps

To send invitation and account emails, configure the following values in `.env`:

1. Create an account with [Resend](https://resend.com), generate an API key, and add it to your environment:

   ```dotenv
   RESEND_API_KEY=re_...
   ```

2. Verify your sending domain in Resend, then set the address you want emails to come from:

   ```dotenv
   EMAIL_FROM="notifications@your-domain.com"
   ```

To share admin and organization invitation links without sending email, set:

```dotenv
INVITATION_EMAIL_ENABLED=false
```

These invitations record an email status of `not_sent`. Set this to `true` (the
default when unset) to attempt sending when `RESEND_API_KEY` is configured.
Password reset emails are unaffected. Restart the development server after
changing environment variables.
