package mileage

import "github.com/erwin-lovecraft/aegismiles/internal/config"

type AccrualRate struct {
	QualifyingRate float64
	BonusRate      float64
}

type Config struct {
	SessionM            config.SessionMConfig
	AccrualRates        map[string]AccrualRate
	ExpirePeriodMinutes int64
}

func NewConfig(cfg config.Config) Config {
	// Khởi tạo các tỷ lệ tích lũy dặm cho các hạng vé
	accrualRates := map[string]AccrualRate{
		"F": {QualifyingRate: 1.5, BonusRate: 0.5}, // First Class
		"C": {QualifyingRate: 1.25, BonusRate: 0.25}, // Business Class
		"Y": {QualifyingRate: 1.0, BonusRate: 0.0}, // Economy Class
		"B": {QualifyingRate: 0.75, BonusRate: 0.0}, // Basic Economy
	}

	return Config{
		SessionM:            cfg.SessionM,
		AccrualRates:        accrualRates,
		ExpirePeriodMinutes: int64(cfg.Loyalty.ExpirePeriodMinutes),
	}
}