package domain

import (
	"time"

	"github.com/google/uuid"
)

type MilesLedger struct {
	ID                   uuid.UUID  `json:"id,string" gorm:"primaryKey"`
	CustomerID           uuid.UUID  `json:"customer_id,string"`
	QualifyingMilesDelta float64    `json:"qualifying_miles_delta"`
	BonusMilesDelta      float64    `json:"bonus_miles_delta"`
	AccrualRequestID     *uuid.UUID `json:"accrual_request_id"`
	Kind                 string     `json:"kind" gorm:"type:text;not null"` // 'accrual','adjustment','expire','correction'
	EarningMonth         time.Time  `json:"earning_month" gorm:"type:date;not null"`
	ExpiresAt            *time.Time `json:"expires_at" gorm:"type:date"`
	Note                 string     `json:"note" gorm:"type:text"`
	CreatedAt            time.Time  `json:"created_at"`
	UpdatedAt            time.Time  `json:"updated_at"`
}

// TableName specifies the table name for GORM
func (MilesLedger) TableName() string {
	return "miles_ledgers"
}
