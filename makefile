.PHONY: dev docker

dev:
	pnpm run dev

docker:
	docker compose up -d
