package mileage

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/erwin-lovecraft/aegismiles/internal/entity"
	"github.com/erwin-lovecraft/aegismiles/internal/gateway/sessionm"
	"github.com/erwin-lovecraft/aegismiles/internal/models/dto"
	"github.com/erwin-lovecraft/aegismiles/internal/pkg/generator"
	"github.com/erwin-lovecraft/aegismiles/internal/repository"
)

type V2Service interface {
	ApproveAccrualRequest(ctx context.Context, requestID int64) error
	GetAccrualRequests(ctx context.Context, customerID int64) ([]entity.AccrualRequest, error)
	CreateAccrualRequest(ctx context.Context, req entity.AccrualRequest) (entity.AccrualRequest, error)
}

type v2service struct {
	repo        repository.Repository
	sessionmSvc sessionm.Client
	cfg         Config
}

func NewV2(repo repository.Repository, sessionmGwy sessionm.Client, cfg Config) V2Service {
	return v2service{
		repo:        repo,
		sessionmSvc: sessionmGwy,
		cfg:         cfg,
	}
}

func (s v2service) GetAccrualRequests(ctx context.Context, customerID int64) ([]entity.AccrualRequest, error) {
	// Gọi repository với các tham số phù hợp
	// Chỉ lọc theo customerID, không lọc theo các tiêu chí khác
	requests, _, err := s.repo.Mileage().GetAccrualRequests(
		ctx,
		"", // keyword
		customerID,
		"", // status
		time.Time{}, // submittedDate
		1,  // page
		100, // size
	)
	return requests, err
}

func (s v2service) CreateAccrualRequest(ctx context.Context, req entity.AccrualRequest) (entity.AccrualRequest, error) {
	// Sử dụng generator.AccrualRequestID thay vì generator.NewID
	id, err := generator.AccrualRequestID.Generate()
	if err != nil {
		return entity.AccrualRequest{}, err
	}
	req.ID = id
	req.Status = "pending"
	req.CreatedAt = time.Now()
	req.UpdatedAt = time.Now()

	err = s.repo.Mileage().SaveAccrualRequest(ctx, req)
	return req, err
}

func (s v2service) ApproveAccrualRequest(ctx context.Context, requestID int64) error {
	// Lấy thông tin yêu cầu tích lũy dặm
	request, err := s.repo.Mileage().GetAccrualRequest(ctx, requestID)
	if err != nil {
		return err
	}

	// Kiểm tra yêu cầu có tồn tại không
	if request.ID == 0 {
		return fmt.Errorf("accrual request does not exists")
	}

	// Kiểm tra trạng thái yêu cầu
	if request.Status != "pending" {
		return fmt.Errorf("invalid status")
	}

	// Lấy thông tin khách hàng
	customer, err := s.repo.Customer().GetByID(ctx, request.CustomerID)
	if err != nil {
		return err
	}

	if customer.SessionMUserID == "" {
		return fmt.Errorf("customer not found in SessionM")
	}

	// Tính toán dặm dựa trên khoảng cách và loại vé
	distances, err := s.repo.Mileage().GetTravelDistance(ctx, request.FromCode, request.ToCode)
	if err != nil {
		return fmt.Errorf("failed to get travel distance: %w", err)
	}

	// Cập nhật số dặm cho yêu cầu
	request.DistanceMiles = distances.Miles

	// Tính toán dặm tích lũy dựa trên loại vé và khoảng cách
	accrualRate, ok := s.cfg.AccrualRates[request.BookingClass]
	if !ok {
		return fmt.Errorf("invalid booking class: %s", request.BookingClass)
	}

	request.QualifyingAccrualRate = accrualRate.QualifyingRate
	request.QualifyingMiles = accrualRate.QualifyingRate * float64(distances.Miles)

	request.BonusAccrualRate = accrualRate.BonusRate
	request.BonusMiles = accrualRate.BonusRate * float64(distances.Miles)

	// Cập nhật điểm trong SessionM
	pointsRequest := dto.SessionMDepositPointsRequest{
		RetailerID: s.cfg.SessionM.RetailerID,
		UserID:     customer.SessionMUserID,
		DepositDetails: []dto.SessionMDepositDetail{
			{
				PointSourceID:  s.cfg.SessionM.PointSourceID,
				Amount:         request.QualifyingMiles + request.BonusMiles,
				PointAccountID: s.cfg.SessionM.PointAccountID,
				ReferenceID:    fmt.Sprintf("REQ-%d", request.ID),
				ReferenceType:  "ACCRUAL-REQUEST",
				Rank:           0,
			},
		},
		AllowPartialSuccess:    false,
		DisableEventPublishing: false,
		Culture:                "en-US",
	}

	// Gọi API SessionM để cập nhật điểm
	sessionMResp, err := s.sessionmSvc.DepositPoints(ctx, pointsRequest)
	if err != nil {
		return err
	}

	if !sessionMResp.Success {
		return fmt.Errorf("failed to deposit points in SessionM: %s", sessionMResp.Message)
	}

	// Cập nhật trạng thái yêu cầu
	request.Status = "approved"
	request.UpdatedAt = time.Now()

	if err := s.repo.Mileage().SaveAccrualRequest(ctx, request); err != nil {
		return err
	}

	// Cập nhật số dặm của khách hàng trong DB
	var qualifyingMiles, bonusMiles float64
	qualifyingMiles = request.QualifyingMiles
	bonusMiles = request.BonusMiles

	if err := s.repo.Mileage().IncreaseCustomerMiles(ctx, request.CustomerID, qualifyingMiles, bonusMiles); err != nil {
		log.Printf("Failed to increase customer miles in DB: %v", err)
		return err
	}

	// Lưu lịch sử giao dịch
	ledgerID, err := generator.MilesLedgerID.Generate()
	if err != nil {
		log.Printf("Failed to generate miles ledger ID: %v", err)
		return err
	}
	
	earningMonth := time.Date(request.DepartureDate.Year(), request.DepartureDate.Month(), 1, 0, 0, 0, 0, request.DepartureDate.Location())
	expirePeriod := time.Duration(s.cfg.ExpirePeriodMinutes) * time.Minute
	expiresAt := earningMonth.Add(expirePeriod)
	
	ledger := entity.MilesLedger{
		ID:                   ledgerID,
		CustomerID:          request.CustomerID,
		QualifyingMilesDelta: qualifyingMiles,
		BonusMilesDelta:     bonusMiles,
		AccrualRequestID:    &request.ID,
		Kind:               "accrual",
		EarningMonth:       earningMonth,
		ExpiresAt:          &expiresAt,
		Note:               fmt.Sprintf("Accrual for flight %s", request.TicketID),
		CreatedAt:          time.Now(),
		UpdatedAt:          time.Now(),
	}

	if err := s.repo.Mileage().SaveMileageLedger(ctx, ledger); err != nil {
		log.Printf("Failed to save mileage ledger: %v", err)
		return err
	}

	return nil
}