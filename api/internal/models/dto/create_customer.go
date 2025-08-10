package dto

type OnboardCustomer struct {
	FirstName    string  `json:"first_name" binding:"required"`
	LastName     string  `json:"last_name" binding:"required"`
	Email        string  `json:"email" binding:"required,email"`
	Phone        *string `json:"phone"`
	ReferrerCode *string `json:"referrer_code"`
}
