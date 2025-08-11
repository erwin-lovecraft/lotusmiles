package v1

import (
	"net/http"

	"github.com/erwin-lovecraft/aegismiles/internal/services/customer"
	"github.com/viebiz/lit"
)

func convertError(err error) error {
	switch err.Error() {
	case customer.ErrCustomerAlreadyExists.Error(),
		customer.ErrCustomerAlreadyOnboard.Error():
		return lit.HTTPError{Status: http.StatusBadRequest, Code: "invalid", Desc: err.Error()}

	default:
		return err
	}
}
