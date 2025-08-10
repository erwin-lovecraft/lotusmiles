package main

import (
	"context"

	"github.com/erwin-lovecraft/aegismiles/internal/config"
	"github.com/viebiz/lit/cors"
	"github.com/viebiz/lit/monitoring/instrumentpg"
	"github.com/viebiz/lit/postgres"
	driverpg "gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
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
