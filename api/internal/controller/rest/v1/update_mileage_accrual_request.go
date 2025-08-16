package v1

import (
	"fmt"
	"net/http"

	"github.com/erwin-lovecraft/aegismiles/internal/entity"
	"github.com/viebiz/lit"
)

func (c Controller) UpdateMileageAccrualRequest(ctx lit.Context) error {
	var body entity.MileageAccrualRequest
	if err := ctx.Bind(&body); err != nil {
		return err
	}

	if err := c.mileageAccrualRequestService.Update(ctx.Request().Context(), &body); err != nil {
		fmt.Printf("CreateByExternalID error: %v\n", err)
		return lit.HTTPError{Status: http.StatusInternalServerError, Code: "internal_error", Desc: "failed to create"}
	}
	return nil
}
