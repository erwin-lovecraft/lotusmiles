package entity

import (
	"time"
)

type MembershipHistory struct {
	ID         int64     `json:"id,string" gorm:"primaryKey"`
	CustomerID int64     `json:"customer_id,string"`
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
