package customer

import (
	"errors"
)

var (
	ErrCustomerAlreadyExists = errors.New("customer already exists with the provided phone number")
)
