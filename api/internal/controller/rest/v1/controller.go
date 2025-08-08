package v1

import (
	"github.com/erwin-lovecraft/aegismiles/internal/services/customer"
)

type Controller struct {
	customerService customer.Service
}

func New(customerService customer.Service) Controller {
	return Controller{
		customerService: customerService,
	}
}
