# Shorten cmd
DOCKER_BUILD_BIN := docker
COMPOSE_BIN := docker compose --file build/docker-compose.yml --project-directory . -p aegismiles

# Run cmd
.PHONY: run web admin
run:
	@$(COMPOSE_BIN) run --rm --service-ports api

web:
	@$(COMPOSE_BIN) run --rm --service-ports web 

admin:
	@$(COMPOSE_BIN) run --rm --service-ports admin

# Setup cmd
.PHONY: build-dev-image build-web-image
# build-api-image:
# 	@$(DOCKER_BUILD_BIN) build -f build/api.Dockerfile -t aegismiles-api:latest .
# 	-docker images -q -f "dangling=true" | xargs docker rmi -f

# build-web-image:
# 	@$(DOCKER_BUILD_BIN) build -f build/web.Dockerfile -t aegismiles-web:latest .
#     -docker images -q -f "dangling=true" | xargs docker rmi -f

# build-admin-image:
# 	@$(DOCKER_BUILD_BIN) build -f build/admin.Dockerfile -t aegismiles-admin:latest .
#     -docker images -q -f "dangling=true" | xargs docker rmi -f

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
