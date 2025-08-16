package v1

import (
	"net/http"

	"github.com/erwin-lovecraft/aegismiles/internal/models/dto"
	"github.com/viebiz/lit"
)

// @Summary      Onboard a new customer
// @Description  Create a new customer account with the provided information
// @Tags         customers
// @Accept       json
// @Produce      json
// @Param        request body dto.OnboardCustomer true "Customer onboarding information"
// @Success      200  {object}  entity.Customer
// @Failure      400  {string}  string
// @Failure      401  {string}  string
// @Failure      500  {string}  string
// @Security     BearerAuth
// @Router       /customers/onboard [post]
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
