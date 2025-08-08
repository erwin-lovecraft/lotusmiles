package v1

import (
	"net/http"

	"github.com/erwin-lovecraft/aegismiles/internal/services/customer"
	"github.com/viebiz/lit"
)

func convertError(err error) error {
	switch err.Error() {
	case customer.ErrCustomerAlreadyExists.Error():
		return lit.HTTPError{Status: http.StatusBadRequest, Code: "validation", Desc: err.Error()}
	default:
		return err
	}
}
