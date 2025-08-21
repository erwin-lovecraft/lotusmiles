// @title           AegisMiles API
// @version         1.0
// @description     API for AegisMiles mileage accrual system
// @termsOfService  http://swagger.io/terms/

// @contact.name   API Support
// @contact.url    http://www.swagger.io/support
// @contact.email  support@swagger.io

// @license.name  Apache 2.0
// @license.url   http://www.apache.org/licenses/LICENSE-2.0.html

// @host      localhost:8080
// @BasePath  /api/v1

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
// @description Type "Bearer" followed by a space and JWT token.

package main

import (
	"context"
	"log"
	"net/http"
	"os"

	"github.com/erwin-lovecraft/aegismiles/internal/config"
	"github.com/erwin-lovecraft/aegismiles/internal/constants"
	"github.com/erwin-lovecraft/aegismiles/internal/gateway/auth0"
	"github.com/erwin-lovecraft/aegismiles/internal/services/mileage"
	"github.com/viebiz/lit/cors"
	"github.com/viebiz/lit/monitoring/instrumentpg"
	"github.com/viebiz/lit/postgres"
	driverpg "gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	_ "github.com/erwin-lovecraft/aegismiles/docs"
	"github.com/erwin-lovecraft/aegismiles/internal/controller/rest/middleware"
	v1 "github.com/erwin-lovecraft/aegismiles/internal/controller/rest/v1"
	"github.com/erwin-lovecraft/aegismiles/internal/pkg/generator"
	"github.com/erwin-lovecraft/aegismiles/internal/repository"
	"github.com/erwin-lovecraft/aegismiles/internal/services/customer"
	"github.com/viebiz/lit"
	"github.com/viebiz/lit/env"
	httpmw "github.com/viebiz/lit/middleware/http"
	"github.com/viebiz/lit/monitoring"
)

func connectDatabase(ctx context.Context, cfg config.Config) (*gorm.DB, error) {
	pool, err := postgres.NewPool(ctx, cfg.Database.URL, cfg.Database.MaxOpenConns, cfg.Database.MaxIdleConns, postgres.AttemptPingUponStartup())
	if err != nil {
		return nil, err
	}

	gormDB, err := gorm.Open(driverpg.New(driverpg.Config{
		Conn: instrumentpg.WithInstrumentation(pool), // Adding instrumentation
	}), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return nil, err
	}

	return gormDB, nil
}

func configCORS(cfg config.CorsConfig) cors.Config {
	corsCfg := cors.New(cfg.AllowOrigins)
	if len(cfg.AllowMethods) > 0 {
		corsCfg.SetAllowMethods(cfg.AllowMethods...)
	}

	if len(cfg.AllowHeaders) > 0 {
		corsCfg.SetAllowHeaders(cfg.AllowHeaders...)
	}

	if len(cfg.ExposeHeaders) > 0 {
		corsCfg.SetExposeHeaders(cfg.ExposeHeaders...)
	}

	if !cfg.AllowCredentials {
		corsCfg.DisableCredentials()
	}

	return corsCfg
}

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

	// Dependency injection
	// Initialize services, repositories, etc. here
	authGwy, err := auth0.New(cfg.UserAPI)

	repo := repository.New(db)
	mileageSvc := mileage.New(repo)
	customerSvc := customer.New(repo, authGwy)
	v1Ctrl := v1.New(customerSvc, mileageSvc)

	// Initialize the server with the handler
	srv := lit.NewHttpServer(cfg.Web.Addr(), routes(ctx, cfg, v1Ctrl))

	return srv.Run()
}

func routes(ctx context.Context, cfg config.Config, v1Ctrl v1.Controller) http.Handler {
	r := lit.NewRouter(ctx)
	r.Use(cors.Middleware(configCORS(cfg.Cors)))

	v1Route := r.Route("/api/v1",
		httpmw.RequestIDMiddleware(),
		// Disable auth for testing
		middleware.Authenticate(cfg),
	)

	// User profile
	v1Route.Group("/profile", func(profile lit.Router) {
		profile.Get("", v1Ctrl.GetCustomerProfile)
	})

	// Accrual requests routes
	v1Route.Group("/accrual-requests", func(accrual lit.Router) {
		accrual.Use(middleware.HasRoles(constants.UserRoleMember))
		accrual.Post("", v1Ctrl.SubmitAccrualRequest)
		accrual.Get("", v1Ctrl.GetMyAccrualRequests)
	})

	// Admin accrual requests routes
	v1Route.Group("/admin/accrual-requests", func(admin lit.Router) {
		admin.Use(middleware.HasRoles(constants.UserRoleAdmin))
		admin.Get("", v1Ctrl.GetAccrualRequests)
		admin.Patch(":id/approve", v1Ctrl.ApproveRequest)
		admin.Patch(":id/reject", v1Ctrl.RejectRequest)
	})

	// Miles ledger routes
	v1Route.Group("/miles-ledgers", func(ledger lit.Router) {
		ledger.Get("", v1Ctrl.GetMileageLedgers)
	})

	// Admin miles ledger routes
	v1Route.Group("/admin/miles-ledgers", func(admin lit.Router) {
		admin.Use(middleware.HasRoles("admin"))
		admin.Get("", v1Ctrl.GetMileageLedgers)
	})

	return r.Handler()
}
