package dto

import (
	"time"
)

type Auth0UserProfile struct {
	UserID        string    `json:"user_id"`
	Email         string    `json:"email"`
	EmailVerified bool      `json:"email_verified"`
	PhoneNumber   string    `json:"phone_number"`
	PhoneVerified bool      `json:"phone_verified"`
	FamilyName    string    `json:"family_name"`
	GivenName     string    `json:"given_name"`
	Name          string    `json:"name"`
	Nickname      string    `json:"nickname"`
	Picture       string    `json:"picture"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}
