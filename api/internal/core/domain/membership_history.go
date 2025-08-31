package domain

import (
	"time"

	"github.com/google/uuid"
)

type MembershipHistory struct {
	ID         uuid.UUID `json:"id,string" gorm:"primaryKey"`
	CustomerID string    `json:"customer_id"`
	OldTier    string    `json:"old_tier" gorm:"type:text;not null"`
	NewTier    string    `json:"new_tier" gorm:"type:text;not null"`
	Reason     string    `json:"reason" gorm:"type:text;not null"` // 'cron_recalc', 'accrual', 'manual'
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

// TableName specifies the table name for GORM
func (MembershipHistory) TableName() string {
	return "membership_histories"
}
