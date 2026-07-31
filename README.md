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
  <a href="#live-demo">Live Demo</a>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT License"></a>
</p>

## Prerequisites

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/installation)
- [Docker](https://docs.docker.com/get-docker/)

## Getting Started

1. Clone the repo:

   ```bash
   git clone git@github.com:smaameri/saas-foundation.git
   cd saas-foundation
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

## Live Demo

Try the [live demo](https://demo.saasfoundation.dev/login?email=admin%40example.test) with these credentials:

- Username: `admin@example.test`
- Password: `Demo1234!`
