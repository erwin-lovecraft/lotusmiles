.PHONY: swagger build run test clean

# Generate Swagger documentation
swagger:
	swag init -g cmd/serverd/main.go -o docs

# Build the application
build:
	go build -o bin/server cmd/serverd/main.go

# Run the application
run:
	go run -mod=mod cmd/serverd/main.go

# Run tests
test:
	go test ./...

# Clean build artifacts
clean:
	rm -rf bin/
	rm -rf docs/docs.go
	rm -rf docs/swagger.json

# Install dependencies
deps:
	go mod download

# Generate and build
all: swagger build

# Start server with Swagger
dev: swagger run
