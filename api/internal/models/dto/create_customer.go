package dto

type OnboardCustomer struct {
	FirstName    string  `json:"first_name" binding:"required"`
	LastName     string  `json:"last_name" binding:"required"`
	Address      *string `json:"address" binding:"required"`
	Phone        string  `json:"phone" binding:"required"`
	ReferrerCode *string `json:"referrer_code"`
}
