package v1

import (
	"fmt"
	"net/http"

	"github.com/erwin-lovecraft/aegismiles/internal/entity"
	"github.com/viebiz/lit"
)

// type CreateMileageAccrualRequestBody struct {
//     Metadata entity.JSONValue `json:"metadata"`
// }

type CreateMileageAccrualRequestResponse struct {
	ID int64 `json:"id"`
}

func (c Controller) CreateMileageAccrualRequest(ctx lit.Context) error {
	var body entity.MileageAccrualRequest
	if err := ctx.Bind(&body); err != nil {
		return err
	}

	if err := c.mileageAccrualRequestService.Create(ctx.Request().Context(), body); err != nil {
		fmt.Printf("CreateByExternalID error: %v\n", err)
		return lit.HTTPError{Status: http.StatusInternalServerError, Code: "internal_error", Desc: "failed to create"}
	}
	return nil
}
