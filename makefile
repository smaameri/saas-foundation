.PHONY: dev docker setup-db

dev:
	pnpm run dev

docker:
	docker compose up -d

setup-db:
	PGPASSWORD=postgres psql -h localhost -U postgres -c "CREATE ROLE app LOGIN CREATEDB PASSWORD 'password';" || true
	PGPASSWORD=postgres psql -h localhost -U postgres -c "ALTER ROLE app CREATEDB;" || true
	PGPASSWORD=postgres psql -h localhost -U postgres -c "CREATE DATABASE saas_foundation_dev OWNER app;" || true
