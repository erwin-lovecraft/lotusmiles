package main

import (
	"context"
	"log"
	"net/http"
	"os"

	"github.com/erwin-lovecraft/aegismiles/internal/config"
	"github.com/erwin-lovecraft/aegismiles/internal/constants"
	"github.com/erwin-lovecraft/aegismiles/internal/controller/rest/middleware"
	v1 "github.com/erwin-lovecraft/aegismiles/internal/controller/rest/v1"
	"github.com/erwin-lovecraft/aegismiles/internal/gateway/auth0"
	"github.com/erwin-lovecraft/aegismiles/internal/pkg/generator"
	"github.com/erwin-lovecraft/aegismiles/internal/repository"
	"github.com/erwin-lovecraft/aegismiles/internal/services/customer"
	"github.com/erwin-lovecraft/aegismiles/internal/services/mileage_accrual_request"
	"github.com/viebiz/lit"
	"github.com/viebiz/lit/cors"
	"github.com/viebiz/lit/env"
	"github.com/viebiz/lit/httpclient"
	httpmw "github.com/viebiz/lit/middleware/http"
	"github.com/viebiz/lit/monitoring"
)

func main() {
	ctx := context.Background()
	if err := run(ctx); err != nil {
		log.Printf("service exited abnormally: %+v", err)
		os.Exit(1)
	}
}

func run(ctx context.Context) error {
	// Read application configuration
	cfg, err := env.ReadAppConfig[config.Config]()
	if err != nil {
		return err
	}

	// Initialize monitoring for logging and tracing
	monitor, err := monitoring.New(monitoring.Config{
		ServerName: cfg.ServerName,
		SentryDSN:  cfg.SentryDSN,
	})
	if err != nil {
		return err
	}
	ctx = monitoring.SetInContext(ctx, monitor)

	// Initialize the ID generator
	if err := generator.Setup(); err != nil {
		return err
	}

	// Connect to the database
	db, err := connectDatabase(ctx, cfg)
	if err != nil {
		return err
	}

	// HTTP conn pool
	sharedPool := httpclient.NewSharedCustomPool()

	// Dependency injection
	// Initialize services, repositories, etc. here
	auth0Client, err := auth0.New(sharedPool, cfg.Auth0)
	if err != nil {
		return err
	}

	repo := repository.New(db)
	customerService := customer.New(repo, auth0Client)
	mileageAccrualRequestService := mileage_accrual_request.New(repo)
	v1Ctrl := v1.New(customerService, mileageAccrualRequestService)

	// Initialize the server with the handler
	srv := lit.NewHttpServer(cfg.Web.Addr(), routes(ctx, cfg, v1Ctrl))

	return srv.Run()
}

func routes(ctx context.Context, cfg config.Config, v1Ctrl v1.Controller) http.Handler {
	r := lit.NewRouter(ctx)
	r.Use(cors.Middleware(configCORS(cfg.Cors)))

	v1 := r.Route("/api/v1",
		httpmw.RequestIDMiddleware(),
		// Disable for testing without Authenticate
		middleware.Authenticate(cfg),
	)

	// User routers
	v1.Get("/profile", v1Ctrl.GetCustomerProfile)

	// Customer routes
	v1.Group("/customers", func(customers lit.Router) {
		customers.Post("/onboard", v1Ctrl.OnboardCustomer, middleware.HasRoles(constants.UserRoleMember))
	})

	// Mileage accrual requests routes
	v1.Get("/mileage-accrual-requests", v1Ctrl.GetMileageAccrualRequests)
	v1.Post("/mileage-accrual-requests", v1Ctrl.CreateMileageAccrualRequest)

	return r.Handler()
}
