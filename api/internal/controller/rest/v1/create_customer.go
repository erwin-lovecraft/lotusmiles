package v1

import (
	"net/http"

	"github.com/erwin-lovecraft/aegismiles/internal/models/dto"
	"github.com/viebiz/lit"
)

func (ctrl Controller) CreateCustomer(c lit.Context) error {
	var req dto.CreateCustomer
	if err := c.Bind(&req); err != nil {
		return err
	}

	customer, err := ctrl.customerService.CreateCustomer(c.Request().Context(), req)
	if err != nil {
		return convertError(err)
	}

	return c.JSON(http.StatusOK, customer)
}
