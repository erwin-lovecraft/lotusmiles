package entity

import (
	"time"
)

type Customer struct {
	ID           int64      `json:"id" gorm:"primaryKey"`
	ExternalID   string     `json:"external_id"`
	FirstName    string     `json:"first_name"`
	LastName     string     `json:"last_name"`
	Email        string     `json:"email"`
	Phone        *string    `json:"phone"`
	ReferrerCode *string    `json:"referrer_code"`
	Onboarded    bool       `json:"onboarded"`
	CreatedAt    time.Time  `json:"created_at" gorm:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at" gorm:"updated_at"`
	DeletedAt    *time.Time `json:"deleted_at,omitempty" gorm:"deleted_at"`
}
