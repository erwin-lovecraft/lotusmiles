package v2

import (
	"net/http"

	"github.com/erwin-lovecraft/aegismiles/internal/core/service/customer"
	"github.com/erwin-lovecraft/aegismiles/internal/core/service/mileage"
	"github.com/erwin-lovecraft/aegismiles/internal/models/dto"
	"github.com/viebiz/lit"
	"github.com/viebiz/lit/iam"
)

type Controller struct {
	customer customer.Service
	mileage  mileage.Service
}

func New(customer customer.Service, mileage mileage.Service) Controller {
	return Controller{
		customer: customer,
		mileage:  mileage,
	}
}

func (s Controller) GetCustomerProfile(c lit.Context) error {
	userProfile := iam.GetUserProfileFromContext(c)

	profile, err := s.customer.GetCustomer(c, userProfile.ID())
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, profile)
}

func convertErr(err error) error {
	switch err.Error() {
	case "accrual request already exists",
		"accrual request does not exists",
		"invalid status",
		"user not found":
		return lit.HTTPError{Status: http.StatusBadRequest, Code: "invalid_request", Desc: err.Error()}
	default:
		return err
	}
}

func (s Controller) GetMyAccrualRequests(c lit.Context) error {
	var req dto.AccrualRequestFilter
	if err := c.Bind(&req); err != nil {
		return err
	}

	data, total, err := s.mileage.GetMyAccrualRequests(c, req)
	if err != nil {
		return convertErr(err)
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"data":  data,
		"total": total,
	})
}

func (s Controller) GetAccrualRequests(c lit.Context) error {
	var req dto.AccrualRequestFilter
	if err := c.Bind(&req); err != nil {
		return err
	}

	data, total, err := s.mileage.GetAccrualRequests(c, req)
	if err != nil {
		return convertErr(err)
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"data":  data,
		"total": total,
	})
}

func (s Controller) SubmitAccrualRequest(c lit.Context) error {
	var req dto.AccrualRequestInput
	if err := c.Bind(&req); err != nil {
		return err
	}

	if err := s.mileage.SubmitAccrualRequest(c, req); err != nil {
		return convertErr(err)
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "submit successfully"})
}

func (s Controller) ApproveRequest(c lit.Context) error {
	var req dto.ApproveRequestInput
	if err := c.Bind(&req); err != nil {
		return err
	}

	if err := s.mileage.ApproveAccrualRequest(c, req.ID); err != nil {
		return convertErr(err)
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "approve successfully"})
}

func (s Controller) RejectRequest(c lit.Context) error {
	var req dto.RejectedRequestInput
	if err := c.Bind(&req); err != nil {
		return err
	}

	if err := s.mileage.RejectAccrualRequest(c, req.ID, req.RejectedReason); err != nil {
		return convertErr(err)
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "reject successfully"})
}

func (s Controller) GetMyMileageLedgers(c lit.Context) error {
	var req dto.MileageLedgerFilter
	if err := c.Bind(&req); err != nil {
		return err
	}

	data, total, err := s.mileage.GetMyMileageLedgers(c, req)
	if err != nil {
		return convertErr(err)
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"data":  data,
		"total": total,
	})
}

func (s Controller) GetMileageLedgers(c lit.Context) error {
	var req dto.MileageLedgerFilter
	if err := c.Bind(&req); err != nil {
		return err
	}

	data, total, err := s.mileage.GetMileageLedgers(c, req)
	if err != nil {
		return convertErr(err)
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"data":  data,
		"total": total,
	})
}
