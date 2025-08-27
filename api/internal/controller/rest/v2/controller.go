package v2

import (
	"log"
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
	// Kiểm tra lỗi cụ thể và trả về HTTP error phù hợp
	switch err.Error() {
	case "accrual request already exists":
		return lit.HTTPError{Status: http.StatusConflict, Code: "duplicate_request", Desc: "Accrual request already exists"}
	case "accrual request does not exists":
		return lit.HTTPError{Status: http.StatusNotFound, Code: "not_found", Desc: "Accrual request not found"}
	case "invalid status":
		return lit.HTTPError{Status: http.StatusBadRequest, Code: "invalid_status", Desc: "Request has invalid status for this operation"}
	case "customer not found in SessionM":
		return lit.HTTPError{Status: http.StatusBadRequest, Code: "customer_not_found", Desc: "Customer not found in loyalty system"}
	case "failed to get travel distance":
		return lit.HTTPError{Status: http.StatusBadRequest, Code: "invalid_route", Desc: "Invalid route or distance information not found"}
	case "invalid booking class":
		return lit.HTTPError{Status: http.StatusBadRequest, Code: "invalid_booking_class", Desc: "Invalid booking class provided"}
	default:
		// Log lỗi không xác định để theo dõi
		log.Printf("Unhandled error: %v", err)
		return lit.HTTPError{Status: http.StatusInternalServerError, Code: "internal_error", Desc: "An internal error occurred"}
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

	// Kiểm tra nếu requests là nil thì trả về mảng rỗng
	if requests == nil {
		requests = []entity.AccrualRequest{}
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

	// Kiểm tra dữ liệu đầu vào
	if req.TicketID == "" {
		return lit.HTTPError{Status: http.StatusBadRequest, Code: "invalid_request", Desc: "ticket_id is required"}
	}

	if req.PNR == "" {
		return lit.HTTPError{Status: http.StatusBadRequest, Code: "invalid_request", Desc: "pnr is required"}
	}

	if req.Carrier == "" {
		return lit.HTTPError{Status: http.StatusBadRequest, Code: "invalid_request", Desc: "carrier is required"}
	}

	if req.BookingClass == "" {
		return lit.HTTPError{Status: http.StatusBadRequest, Code: "invalid_request", Desc: "booking_class is required"}
	}

	if req.FromCode == "" {
		return lit.HTTPError{Status: http.StatusBadRequest, Code: "invalid_request", Desc: "from_code is required"}
	}

	if req.ToCode == "" {
		return lit.HTTPError{Status: http.StatusBadRequest, Code: "invalid_request", Desc: "to_code is required"}
	}

	if req.DepartureDate.IsZero() {
		return lit.HTTPError{Status: http.StatusBadRequest, Code: "invalid_request", Desc: "departure_date is required"}
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

	return c.JSON(http.StatusCreated, map[string]interface{}{
		"message": "submit successfully",
		"id":      createdRequest.ID,
	})
}

func (s Controller) ApproveRequest(c lit.Context) error {
	var req dto.ApproveRequestInput
	if err := c.Bind(&req); err != nil {
		return err
	}

	// Kiểm tra ID có hợp lệ không
	if req.ID <= 0 {
		return lit.HTTPError{Status: http.StatusBadRequest, Code: "invalid_request", Desc: "invalid request id"}
	}

	// Kiểm tra quyền admin
	userProfile := iam.GetUserProfileFromContext(c)
	isAdmin := false
	for _, role := range userProfile.GetRoles() {
		if role == "admin" {
			isAdmin = true
			break
		}
	}

	if !isAdmin {
		return lit.HTTPError{Status: http.StatusForbidden, Code: "forbidden", Desc: "you don't have permission to approve request"}
	}

	if err := s.mileage.ApproveAccrualRequest(c, req.ID); err != nil {
		return convertErr(err)
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "approve successfully"})
}