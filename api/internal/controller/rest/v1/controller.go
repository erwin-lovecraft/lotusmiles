package v1

import (
	"github.com/erwin-lovecraft/aegismiles/internal/services/customer"
	"github.com/erwin-lovecraft/aegismiles/internal/services/mileage_accrual_request"
)

type Controller struct {
	customerService              customer.Service
	mileageAccrualRequestService mileage_accrual_request.Service
}

func New(customerService customer.Service, mileageAccrualRequestService mileage_accrual_request.Service) Controller {
	return Controller{
		customerService:              customerService,
		mileageAccrualRequestService: mileageAccrualRequestService,
	}
}
