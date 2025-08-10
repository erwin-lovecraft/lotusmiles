package customer

import (
	"errors"
)

var (
	ErrCustomerAlreadyExists = errors.New("customer already exists with the provided phone number")
	ErrUserProfileEmpty      = errors.New("user profile is empty")
)
