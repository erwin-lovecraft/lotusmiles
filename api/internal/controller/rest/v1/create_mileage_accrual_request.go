package v1

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/erwin-lovecraft/aegismiles/internal/entity"
	"github.com/viebiz/lit"
	"github.com/viebiz/lit/iam"
)

type CreateMileageAccrualRequestBody struct {
    Metadata entity.JSONValue `json:"metadata"`
}

type CreateMileageAccrualRequestResponse struct {
    ID int64 `json:"id"`
}

func (c Controller) CreateMileageAccrualRequest(ctx lit.Context) error {
    var body CreateMileageAccrualRequestBody
    if err := json.NewDecoder(ctx.Request().Body).Decode(&body); err != nil {
        return lit.HTTPError{Status: http.StatusBadRequest, Code: "bad_request", Desc: "invalid body"}
    }

    	userProfile := iam.GetUserProfileFromContext(ctx.Request().Context())
	fmt.Printf("Creating request for user: %s\n", userProfile.ID())
	created, err := c.mileageAccrualRequestService.CreateByExternalID(ctx.Request().Context(), userProfile.ID(), body.Metadata)
	if err != nil {
		fmt.Printf("CreateByExternalID error: %v\n", err)
		return lit.HTTPError{Status: http.StatusInternalServerError, Code: "internal_error", Desc: "failed to create"}
	}
	if created.ID == 0 {
		fmt.Printf("User not found: %s\n", userProfile.ID())
		return lit.HTTPError{Status: http.StatusBadRequest, Code: "user_not_found", Desc: "user not found"}
	}
	fmt.Printf("Created request with ID: %d\n", created.ID)
	return ctx.JSON(http.StatusCreated, CreateMileageAccrualRequestResponse{ID: created.ID})
}


