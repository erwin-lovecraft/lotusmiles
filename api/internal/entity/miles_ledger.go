package entity

import (
	"time"
)

type MilesLedger struct {
	ID                   int64     `json:"id" gorm:"primaryKey"`
	CustomerID           int64     `json:"customer_id"`
	QualifyingMilesDelta float64   `json:"qualifying_miles_delta"`
	BonusMilesDelta      float64   `json:"bonus_miles_delta"`
	AccrualRequestID     *int64    `json:"accrual_request_id"`
	CreatedAt            time.Time `json:"created_at"`
	UpdatedAt            time.Time `json:"updated_at"`
}

// TableName specifies the table name for GORM
func (MilesLedger) TableName() string {
	return "miles_ledgers"
}
