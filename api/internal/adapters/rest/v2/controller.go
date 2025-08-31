package v2

import (
	"github.com/erwin-lovecraft/lotusmiles/internal/adapters/rest/v1"
	"github.com/erwin-lovecraft/lotusmiles/internal/core/services/customer"
	"github.com/erwin-lovecraft/lotusmiles/internal/core/services/mileage"
)

type Controller struct {
	v1.Controller
}

func New(customer customer.Service, mileage mileage.Service) Controller {
	return Controller{
		Controller: v1.New(customer, mileage),
	}
}
