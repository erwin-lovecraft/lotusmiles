package v1

import (
	"net/http"

	"github.com/erwin-lovecraft/aegismiles/internal/pkg/userprofile"
	"github.com/viebiz/lit"
)

func (ctrl Controller) GetCustomerProfile(c lit.Context) error {
	userProfile := userprofile.FromContext(c.Request().Context())

	profile, err := ctrl.customerService.GetCustomerProfile(c.Request().Context(), userProfile.ID())
	if err != nil {
		return convertError(err)
	}

	return c.JSON(http.StatusOK, profile)
}
