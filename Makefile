# Shorten cmd
DOCKER_BUILD_BIN := docker
COMPOSE_BIN := docker compose --file build/docker-compose.yml --project-directory . -p aegismiles
COMPOSE_TOOL_RUN := $(COMPOSE_BIN) run --rm --service-ports api

# Run cmd
.PHONY: run
run:
	@$(COMPOSE_TOOL_RUN) sh -c "go run ./cmd/serverd"

# Setup cmd
.PHONY: build-dev-image
build-dev-image:
	@$(DOCKER_BUILD_BIN) build -f build/api.Dockerfile -t aegismiles-api:latest .
	-docker images -q -f "dangling=true" | xargs docker rmi -f

pg:
	@$(COMPOSE_BIN) up -d pg

setup: build-dev-image pg db-migrate

# Helper cmd
.PHONY: teardown
teardown:
	@$(COMPOSE_BIN) down

db-migrate:
	@${COMPOSE_BIN} run --rm db-migrate sh -c 'migrate -path /migrations -database "$$DB_URL" up'

db-drop:
	@${COMPOSE_BIN} run --rm db-migrate sh -c 'migrate -path /migrations -database "$$DB_URL" drop'
