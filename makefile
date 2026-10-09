.PHONY: dev docker worker

dev:
	pnpm run dev

worker:
	pnpm dlx inngest-cli@latest dev -u http://localhost:3000/api/inngest

docker:
	docker compose up -d
