package mileage

import "github.com/erwin-lovecraft/aegismiles/internal/config"

type Config struct {
	SessionM config.SessionMConfig
}

func NewConfig(cfg config.Config) Config {
	return Config{
		SessionM: cfg.SessionM,
	}
}