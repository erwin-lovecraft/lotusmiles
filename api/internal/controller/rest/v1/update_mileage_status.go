package v1

import (
	"net/http"
	"strconv"

	"github.com/erwin-lovecraft/aegismiles/internal/models/dto"
	"github.com/viebiz/lit"
)

// @Summary      Update mileage accrual request status
// @Description  Update the status of a mileage accrual request (approve, reject, cancel, etc.)
// @Tags         mileage-accrual-requests
// @Accept       json
// @Produce      json
// @Param        id   path      int  true  "Mileage Accrual Request ID"
// @Param        request body   dto.UpdateMileageStatus true "Status update information"
// @Success      200  {object}  map[string]string
// @Failure      400  {string}  string
// @Failure      401  {string}  string
// @Failure      404  {string}  string
// @Failure      500  {string}  string
// @Security     BearerAuth
// @Router       /mileage-accrual-requests/{id}/status [put]
func (ctrl Controller) UpdateMileageStatus(c lit.Context) error {
	// Lấy ID từ URL parameter
	idStr := c.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		return lit.HTTPError{Status: http.StatusBadRequest, Code: "invalid_id", Desc: "Invalid ID format"}
	}

	// Bind request body
	var req dto.UpdateMileageStatus
	if err := c.Bind(&req); err != nil {
		return lit.HTTPError{Status: http.StatusBadRequest, Code: "invalid_request", Desc: "Invalid request body"}
	}

	// Gọi service để update status
	err = ctrl.mileageAccrualRequestService.UpdateStatus(c.Request().Context(), id, req)
	if err != nil {
		return convertError(err)
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "Status updated successfully"})
}
