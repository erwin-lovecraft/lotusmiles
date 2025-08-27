package dto

import (
	"time"
)

// SessionMUserProfile là cấu trúc dữ liệu cho thông tin profile người dùng từ SessionM
type SessionMUserProfile struct {
	ID          string    `json:"id"`
	ExternalID  string    `json:"external_id"`
	Email       string    `json:"email"`
	FirstName   string    `json:"first_name"`
	LastName    string    `json:"last_name"`
	Gender      string    `json:"gender"`
	DOB         string    `json:"dob"`
	Address     string    `json:"address"`
	City        string    `json:"city"`
	State       string    `json:"state"`
	Zip         string    `json:"zip"`
	Country     string    `json:"country"`
	OptedIn     bool      `json:"opted_in"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
	PhoneNumber string    `json:"phone_number"`
}

// SessionMUserProfileResponse là cấu trúc dữ liệu cho response từ API lấy thông tin người dùng
type SessionMUserProfileResponse struct {
	User SessionMUserProfile `json:"user"`
}

// SessionMCreateUserRequest là cấu trúc dữ liệu cho request tạo người dùng mới
type SessionMCreateUserRequest struct {
	User SessionMCreateUserData `json:"user"`
}

// SessionMCreateUserData là cấu trúc dữ liệu cho thông tin người dùng khi tạo mới
type SessionMCreateUserData struct {
	ExternalID    string                  `json:"external_id"`
	OptedIn       string                  `json:"opted_in"`
	ExternalIDType string                 `json:"external_id_type"`
	Email         string                  `json:"email"`
	FirstName     string                  `json:"first_name"`
	LastName      string                  `json:"last_name"`
	Gender        string                  `json:"gender"`
	DOB           string                  `json:"dob"`
	Address       string                  `json:"address"`
	City          string                  `json:"city"`
	State         string                  `json:"state"`
	Zip           string                  `json:"zip"`
	Country       string                  `json:"country"`
	PhoneNumbers  []SessionMPhoneNumber   `json:"phone_numbers,omitempty"`
}

// SessionMPhoneNumber là cấu trúc dữ liệu cho thông tin số điện thoại
type SessionMPhoneNumber struct {
	PhoneNumber     string   `json:"phone_number"`
	PhoneType       string   `json:"phone_type"`
	PreferenceFlags []string `json:"preference_flags"`
}

// SessionMCreateUserResponse là cấu trúc dữ liệu cho response từ API tạo người dùng mới
type SessionMCreateUserResponse struct {
	User SessionMUserProfile `json:"user"`
}

// SessionMDepositPointsRequest là cấu trúc dữ liệu cho request nạp điểm
type SessionMDepositPointsRequest struct {
	RetailerID            string                      `json:"retailer_id"`
	UserID                string                      `json:"user_id"`
	DepositDetails        []SessionMDepositDetail     `json:"deposit_details"`
	AllowPartialSuccess   bool                        `json:"allow_partial_success"`
	DisableEventPublishing bool                       `json:"disable_event_publishing"`
	Culture               string                      `json:"culture"`
}

// SessionMDepositDetail là cấu trúc dữ liệu cho chi tiết nạp điểm
type SessionMDepositDetail struct {
	PointSourceID  string  `json:"point_source_id"`
	Amount         float64 `json:"amount"`
	PointAccountID string  `json:"point_account_id"`
	ReferenceID    string  `json:"reference_id"`
	ReferenceType  string  `json:"reference_type"`
	Rank           int     `json:"rank"`
}

// SessionMDepositPointsResponse là cấu trúc dữ liệu cho response từ API nạp điểm
type SessionMDepositPointsResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}