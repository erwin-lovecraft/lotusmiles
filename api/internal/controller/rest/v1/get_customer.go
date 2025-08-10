package v1

import (
	"net/http"

	"github.com/viebiz/lit"
	"github.com/viebiz/lit/iam"
)

func (ctrl Controller) GetCustomerProfile(c lit.Context) error {
	userProfile := iam.GetUserProfileFromContext(c.Request().Context())

	profile, err := ctrl.customerService.GetCustomerProfile(c.Request().Context(), userProfile.ID())
	if err != nil {
		return convertError(err)
	}

	return c.JSON(http.StatusOK, profile)
}
