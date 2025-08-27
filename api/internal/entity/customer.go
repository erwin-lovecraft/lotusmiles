package entity

import (
	"time"

	"github.com/google/uuid"
)

type Customer struct {
	ID                   uuid.UUID `json:"id" gorm:"primaryKey"`
	QualifyingMilesTotal float64   `json:"qualifying_miles_total"`
	BonusMilesTotal      float64   `json:"bonus_miles_total"`
	MemberTier           string    `json:"member_tier"`
	Auth0UserID          string    `json:"auth0_user_id"`
	Email                string    `json:"email"`
	Phone                string    `json:"phone"`
	FirstName            string    `json:"first_name"`
	LastName             string    `json:"last_name"`
	SessionMUserID       string    `json:"sessionm_user_id" gorm:"column:sessionm_user_id"`
	SessionMExternalID   string    `json:"sessionm_external_id" gorm:"column:sessionm_external_id"`
	CreatedAt            time.Time `json:"created_at"`
	UpdatedAt            time.Time `json:"updated_at"`
}

// TableName specifies the table name for GORM
func (Customer) TableName() string {
	return "customers"
}
