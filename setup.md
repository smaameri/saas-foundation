# Setup

## Getting Started

1. Run Docker to start the database:

   ```bash
   make docker
   ```

2. Update `.env` with your database URL, username, password, and database name (or leave the defaults).

3. Optionally update the `make setup-db` command in the `Makefile` with your actual database user and password.

4. Create the database role and database:

   ```bash
   make setup-db
   ```

5. Generate the auth schema models:

   ```bash
   pnpm dlx auth@latest generate
   ```

6. Run the initial database migration:

   ```bash
   pnpm prisma migrate dev
   ```

7. Start the development server:

   ```bash
   make dev
   ```
