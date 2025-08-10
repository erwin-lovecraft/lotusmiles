package v1

import (
	"net/http"

	"github.com/erwin-lovecraft/aegismiles/internal/models/dto"
	"github.com/viebiz/lit"
)

func (ctrl Controller) OnboardCustomer(c lit.Context) error {
	var req dto.OnboardCustomer
	if err := c.Bind(&req); err != nil {
		return err
	}

	customer, err := ctrl.customerService.OnboardCustomer(c.Request().Context(), req)
	if err != nil {
		return convertError(err)
	}

	return c.JSON(http.StatusOK, customer)
}
