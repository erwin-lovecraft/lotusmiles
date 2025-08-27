package v2

import (
	"net/http"

	"github.com/erwin-lovecraft/aegismiles/internal/entity"
	"github.com/erwin-lovecraft/aegismiles/internal/models/dto"
	"github.com/erwin-lovecraft/aegismiles/internal/services/customer"
	"github.com/erwin-lovecraft/aegismiles/internal/services/mileage"
	"github.com/viebiz/lit"
	"github.com/viebiz/lit/iam"
)

type Controller struct {
	customer customer.V2Service
	mileage  mileage.V2Service
}

func New(customer customer.V2Service, mileage mileage.V2Service) Controller {
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

func (s Controller) GetSessionMProfile(c lit.Context) error {
	userProfile := iam.GetUserProfileFromContext(c)

	profile, err := s.customer.GetSessionMCustomer(c, userProfile.ID())
	if err != nil {
		return convertErr(err)
	}

	return c.JSON(http.StatusOK, profile)
}

func convertErr(err error) error {
	switch err.Error() {
	case "accrual request already exists",
		"accrual request does not exists",
		"invalid status",
		"customer not found in SessionM":
		return lit.HTTPError{Status: http.StatusBadRequest, Code: "invalid_request", Desc: err.Error()}
	default:
		return err
	}
}

func (s Controller) GetAccrualRequests(c lit.Context) error {
	userProfile := iam.GetUserProfileFromContext(c)

	// Lấy thông tin khách hàng
	customer, err := s.customer.GetCustomer(c, userProfile.ID())
	if err != nil {
		return err
	}

	// Lấy danh sách yêu cầu tích lũy dặm
	requests, err := s.mileage.GetAccrualRequests(c, customer.ID)
	if err != nil {
		return convertErr(err)
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"data":  requests,
		"total": len(requests),
	})
}

func (s Controller) SubmitAccrualRequest(c lit.Context) error {
	userProfile := iam.GetUserProfileFromContext(c)

	// Lấy thông tin khách hàng
	customer, err := s.customer.GetCustomer(c, userProfile.ID())
	if err != nil {
		return err
	}

	// Tạo yêu cầu tích lũy dặm
	var req dto.AccrualRequestInput
	if err := c.Bind(&req); err != nil {
		return err
	}

	accrualRequest := entity.AccrualRequest{
		CustomerID:           customer.ID,
		TicketID:             req.TicketID,
		PNR:                  req.PNR,
		Carrier:              req.Carrier,
		BookingClass:         req.BookingClass,
		FromCode:             req.FromCode,
		ToCode:               req.ToCode,
		DepartureDate:        req.DepartureDate,
		TicketImageURL:       req.TicketImageURL,
		BoardingPassImageURL: req.BoardingPassImageURL,
		// Mặc định QualifyingMiles và BonusMiles là 0, sẽ được tính toán sau khi admin duyệt
		QualifyingMiles:      0,
		BonusMiles:           0,
	}

	// Lưu yêu cầu
	createdRequest, err := s.mileage.CreateAccrualRequest(c, accrualRequest)
	if err != nil {
		return convertErr(err)
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"message": "submit successfully",
		"id":      createdRequest.ID,
	})
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