package dto

import (
	"time"

	"github.com/google/uuid"
)

type SessionMUserProfile struct {
	ID                        uuid.UUID           `json:"id"`
	ExternalID                string              `json:"external_id"`
	OptedIn                   bool                `json:"opted_in"`
	Activated                 bool                `json:"activated"`
	ProxyIDs                  []interface{}       `json:"proxy_ids"`
	AvailablePoints           float64             `json:"available_points"`
	TestPoints                float64             `json:"test_points"`
	UnclaimedAchievementCount int                 `json:"unclaimed_achievement_count"`
	FirstName                 string              `json:"first_name"`
	LastName                  string              `json:"last_name"`
	Email                     string              `json:"email"`
	City                      string              `json:"city"`
	Zip                       string              `json:"zip"`
	Country                   string              `json:"country"`
	Suspended                 bool                `json:"suspended"`
	RegisteredAt              string              `json:"registered_at"`
	ProfilePhotoUrl           string              `json:"profile_photo_url"`
	TestAccount               bool                `json:"test_account"`
	AccountStatus             string              `json:"account_status"`
	Tier                      string              `json:"tier"`
	TierSystem                string              `json:"tier_system"`
	TierPoints                float64             `json:"tier_points"`
	TierEnteredAt             string              `json:"tier_entered_at"`
	TierResetsAt              string              `json:"tier_resets_at"`
	ReferrerCode              string              `json:"referrer_code"`
	TierDetails               SessionMTierDetails `json:"tier_details"`
	CreatedAt                 string              `json:"created_at"`
	UpdatedAt                 string              `json:"updated_at"`
}

type SessionMUserProfileResponse struct {
	User SessionMUserProfile `json:"user"`
}

type SessionMCreateUserRequest struct {
	User SessionMCreateUserData `json:"user"`
}

type SessionMCreateUserData struct {
	ExternalID     string                `json:"external_id"`
	OptedIn        string                `json:"opted_in"`
	ExternalIDType string                `json:"external_id_type"`
	Email          string                `json:"email"`
	FirstName      string                `json:"first_name"`
	LastName       string                `json:"last_name"`
	Gender         string                `json:"gender"`
	DOB            string                `json:"dob"`
	Address        string                `json:"address"`
	City           string                `json:"city"`
	State          string                `json:"state"`
	Zip            string                `json:"zip"`
	Country        string                `json:"country"`
	PhoneNumbers   []SessionMPhoneNumber `json:"phone_numbers,omitempty"`
}

type SessionMPhoneNumber struct {
	PhoneNumber     string   `json:"phone_number"`
	PhoneType       string   `json:"phone_type"`
	PreferenceFlags []string `json:"preference_flags"`
}

type SessionMCreateUserResponse struct {
	User SessionMUserProfile `json:"user"`
}

type SessionMDepositPointsRequest struct {
	RetailerID             string                  `json:"retailer_id"`
	UserID                 string                  `json:"user_id"`
	DepositDetails         []SessionMDepositDetail `json:"deposit_details"`
	AllowPartialSuccess    bool                    `json:"allow_partial_success"`
	DisableEventPublishing bool                    `json:"disable_event_publishing"`
	Culture                string                  `json:"culture"`
}

type SessionMDepositDetail struct {
	PointSourceID  string  `json:"point_source_id"`
	Amount         float64 `json:"amount"`
	PointAccountID string  `json:"point_account_id"`
	ReferenceID    string  `json:"reference_id"`
	ReferenceType  string  `json:"reference_type"`
	Rank           int     `json:"rank"`
}

type SessionMDepositPointsResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

type SessionMTierDetails struct {
	TierLevels           []SessionMTierLevel          `json:"tier_levels"`
	PointAccountBalances SessionMPointAccountBalances `json:"point_account_balances"`
}

type SessionMTierLevel struct {
	ID           string    `json:"id"`
	TierSystemID string    `json:"tier_system_id"`
	TierLevelID  string    `json:"tier_level_id"`
	UserID       string    `json:"user_id"`
	JoinDate     time.Time `json:"join_date"`
	TierOverview struct {
		ID           string `json:"id"`
		TierSystemID string `json:"tier_system_id"`
		RetailerID   string `json:"retailer_id"`
		Name         string `json:"name"`
		Rank         int    `json:"rank"`
		Status       int    `json:"status"`
	} `json:"tier_overview"`
	TierProgress []interface{} `json:"tier_progress"`
}

type SessionMPointAccountBalances struct {
	RetailerID string `json:"retailer_id"`
	UserID     string `json:"user_id"`
	Summary    struct {
		TotalPoints    float64 `json:"total_points"`
		LifeTimePoints float64 `json:"life_time_points"`
	} `json:"summary"`
	Details []SessionMPointAccountBalancesDetail `json:"details"`
}

type SessionMPointAccountBalancesDetail struct {
	AccountName        string  `json:"account_name"`
	UserPointAccountID string  `json:"user_point_account_id"`
	PointAccountID     string  `json:"point_account_id"`
	GroupingLabel      string  `json:"grouping_label,omitempty"`
	AvailableBalance   float64 `json:"available_balance"`
	LifeTimeValue      float64 `json:"life_time_value"`
}
