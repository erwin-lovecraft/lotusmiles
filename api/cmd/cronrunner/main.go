package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"github.com/erwin-lovecraft/aegismiles/internal/config"
	"github.com/erwin-lovecraft/aegismiles/internal/pkg/generator"
	"github.com/erwin-lovecraft/aegismiles/internal/repository"
	"github.com/erwin-lovecraft/aegismiles/internal/services/cron"
	"github.com/erwin-lovecraft/aegismiles/internal/services/membership"
	"github.com/erwin-lovecraft/aegismiles/internal/services/mileage"
	"github.com/viebiz/lit/env"
)

func main() {
	// Load configuration using env.ReadAppConfig
	cfg, err := env.ReadAppConfig[config.Config]()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Initialize ID generators
	if err := generator.Setup(); err != nil {
		log.Fatalf("Failed to setup ID generators: %v", err)
	}

	// Initialize database
	db, err := initDatabase(cfg.Database)
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	// Initialize repositories
	repo := repository.New(db, cfg.Loyalty)

	// Initialize services
	membershipSvc := membership.New(repo, cfg.Loyalty)
	mileageSvc := mileage.New(repo, membershipSvc, cfg.Loyalty)

	// Initialize cron scheduler
	scheduler, err := cron.NewScheduler(repo, mileageSvc, membershipSvc, cfg)
	if err != nil {
		log.Fatalf("Failed to create cron scheduler: %v", err)
	}

	// Start cron scheduler
	if err := scheduler.Start(); err != nil {
		log.Fatalf("Failed to start cron scheduler: %v", err)
	}

	// Start health check HTTP server
	server := &http.Server{
		Addr:         cfg.Web.Addr(),
		Handler:      createHealthCheckMux(),
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	// Start HTTP server in a goroutine
	go func() {
		log.Printf("Starting health check server on %s", cfg.Web.Addr())
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Printf("Health check server error: %v", err)
		}
	}()

	// Setup graceful shutdown
	shutdown := make(chan os.Signal, 1)
	signal.Notify(shutdown, syscall.SIGINT, syscall.SIGTERM)

	// Wait for shutdown signal
	<-shutdown
	log.Println("Received shutdown signal, stopping services...")

	// Graceful shutdown
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	// Stop HTTP server
	if err := server.Shutdown(ctx); err != nil {
		log.Printf("Error shutting down HTTP server: %v", err)
	}

	// Stop scheduler
	scheduler.Stop()

	log.Println("Cron runner stopped gracefully")
}

func initDatabase(dbConfig config.DatabaseConfig) (*gorm.DB, error) {
	if dbConfig.URL == "" {
		return nil, fmt.Errorf("DATABASE.URL is required")
	}

	db, err := gorm.Open(postgres.Open(dbConfig.URL), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	// Configure connection pool
	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("failed to get underlying sql.DB: %w", err)
	}

	maxOpenConns := dbConfig.MaxOpenConns
	maxIdleConns := dbConfig.MaxIdleConns

	sqlDB.SetMaxOpenConns(maxOpenConns)
	sqlDB.SetMaxIdleConns(maxIdleConns)

	// Test database connection
	if err := sqlDB.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	log.Printf("Database connected successfully (max_open_conns: %d, max_idle_conns: %d)", maxOpenConns, maxIdleConns)

	return db, nil
}

// createHealthCheckMux creates the HTTP mux for health check endpoints
func createHealthCheckMux() http.Handler {
	mux := http.NewServeMux()

	// Health check endpoint
	mux.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	return mux
}
