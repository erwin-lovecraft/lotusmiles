# Aegismile API Documentation

## Folder structure

- `cmd/`: Contains the main application entry point.
- `data/migrations/`: Contains the database migration files.
- `internal/`: Contains the internal packages of the application.
  - `config/`: Contains ENV configuration models.
  - `controllers/`: Contains the HTTP controllers for handling requests.
  - `entity/`: Contains the entity models for the application.
  - `repository/`: Contains the repository interfaces and implementations for data access.
  - `service/`: Contains the business logic and service layer.
  - `pkg/`: Contains reusable packages that can be used across different applications.
- `vendor/`: Contains the dependencies of the application (like node_modules in JavaScript).
- `go.mod`: The Go module file that defines the module's dependencies (like package.json in JavaScript).

## How to run

```bash
# Start all dependencies using Docker Compose
make setup

# Run the API server
cd api
go run ./cmd/serverd
```

Debugging using VSCode: using the `launch.json` file in the `.vscode` directory, you can set breakpoints and debug the application.
