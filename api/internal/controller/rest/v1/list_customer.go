package v1

import (
	"net/http"

	"github.com/erwin-lovecraft/aegismiles/internal/entity"
	"github.com/erwin-lovecraft/aegismiles/internal/models/dto"
	"github.com/viebiz/lit"
)

func (ctrl Controller) ListCustomers(c lit.Context) error {
	var filter dto.CustomerFilter
	if err := c.Bind(&filter); err != nil {
		return err
	}

	customers, total, err := ctrl.customerService.ListCustomers(c.Request().Context(), filter)
	if err != nil {
		return err
	}

	response := struct {
		Customers []entity.Customer `json:"customers"`
		Total     int64             `json:"total"`
		Page      int               `json:"page"`
		Size      int               `json:"size"`
	}{
		Customers: customers,
		Total:     total,
		Page:      filter.Page,
		Size:      filter.Size,
	}

	return c.JSON(http.StatusOK, response)
}
