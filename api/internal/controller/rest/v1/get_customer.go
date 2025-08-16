package v1

import (
	"net/http"

	"github.com/viebiz/lit"
	"github.com/viebiz/lit/iam"
)

// @Summary      Get customer profile
// @Description  Retrieve the current customer's profile information
// @Tags         customers
// @Accept       json
// @Produce      json
// @Success      200  {object}  entity.Customer
// @Failure      401  {string}  string
// @Failure      404  {string}  string
// @Failure      500  {string}  string
// @Security     BearerAuth
// @Router       /profile [get]
func (ctrl Controller) GetCustomerProfile(c lit.Context) error {
	userProfile := iam.GetUserProfileFromContext(c.Request().Context())

	profile, err := ctrl.customerService.GetCustomerProfile(c.Request().Context(), userProfile.ID())
	if err != nil {
		return convertError(err)
	}

	return c.JSON(http.StatusOK, profile)
}
