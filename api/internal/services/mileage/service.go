package mileage

import (
	"context"
	"errors"
	"time"

	"github.com/erwin-lovecraft/aegismiles/internal/constants"
	"github.com/erwin-lovecraft/aegismiles/internal/entity"
	"github.com/erwin-lovecraft/aegismiles/internal/models/dto"
	"github.com/erwin-lovecraft/aegismiles/internal/repository"
	"github.com/viebiz/lit/iam"
)

type Service interface {
	GetMyAccrualRequests(ctx context.Context, filter dto.AccrualRequestFilter) ([]entity.AccrualRequest, int64, error)

	GetAccrualRequests(ctx context.Context, filter dto.AccrualRequestFilter) ([]entity.AccrualRequest, int64, error)

	SubmitAccrualRequest(ctx context.Context, request dto.AccrualRequestInput) error

	ApproveAccrualRequest(ctx context.Context, reqID int64) error

	RejectAccrualRequest(ctx context.Context, reqID int64, rejectedReason string) error

	GetMyMileageLedgers(ctx context.Context, filter dto.MileageLedgerFilter) ([]entity.MilesLedger, int64, error)

	GetMileageLedgers(ctx context.Context, filter dto.MileageLedgerFilter) ([]entity.MilesLedger, int64, error)
}

type service struct {
	repo repository.Repository
}

func New(repo repository.Repository) Service {
	return service{
		repo: repo,
	}
}

func (s service) SubmitAccrualRequest(ctx context.Context, request dto.AccrualRequestInput) error {
	userProfile := iam.GetUserProfileFromContext(ctx)

	// 1. Get customer by user_id
	customer, err := s.repo.Customer().GetByUserID(ctx, userProfile.ID())
	if err != nil {
		return err
	}

	// 2. Check exists request exists
	existedRequest, err := s.repo.Mileage().GetAccrualRequestByFilter(ctx, customer.ID, request.TicketID, request.PNR)
	if err != nil {
		return err
	}

	if existedRequest.ID != 0 {
		return errors.New("accrual request already exists")
	}

	// 2. Mapping value
	e := entity.AccrualRequest{
		CustomerID:           customer.ID,
		TicketID:             request.TicketID,
		PNR:                  request.PNR,
		Carrier:              request.Carrier,
		BookingClass:         request.BookingClass,
		FromCode:             request.FromCode,
		ToCode:               request.ToCode,
		DepartureDate:        request.DepartureDate,
		TicketImageURL:       request.TicketImageURL,
		BoardingPassImageURL: request.BoardingPassImageURL,
		Status:               constants.RequestStatusInProgress,
	}

	// 3. Calculate miles and information
	if err := s.calculateMiles(ctx, &e); err != nil {
		return err
	}

	// 4. Save to database
	if err := s.repo.Mileage().SaveAccrualRequest(ctx, e); err != nil {
		return err
	}

	return nil
}

func (s service) calculateMiles(ctx context.Context, req *entity.AccrualRequest) error {
	distances, err := s.repo.Mileage().GetTravelDistance(ctx, req.FromCode, req.ToCode)
	if err != nil {
		return err
	}
	req.DistanceMiles = distances.Miles

	accrualRate := constants.AccuralRates[req.BookingClass]
	req.QualifyingAccrualRate = accrualRate.QualifyingMile()
	req.QualifyingMiles = req.QualifyingAccrualRate * float64(distances.Miles)

	req.BonusAccrualRate = accrualRate.BonusMileAt(float64(distances.Miles))
	req.BonusMiles = req.BonusAccrualRate * float64(distances.Miles)

	return nil
}

func (s service) ApproveAccrualRequest(ctx context.Context, reqID int64) error {
	// 1. Get existed accrual request
	existedRequest, err := s.repo.Mileage().GetAccrualRequest(ctx, reqID)
	if err != nil {
		return err
	}

	if existedRequest.ID == 0 {
		return errors.New("accrual request does not exists")
	}

	if existedRequest.Status != constants.RequestStatusInProgress {
		return errors.New("invalid status")
	}

	userProfile := iam.GetUserProfileFromContext(ctx)
	userID := userProfile.ID()

	// 2. Do approve logic and save data
	existedRequest.Status = constants.RequestStatusApproved
	existedRequest.ReviewerID = &userID
	now := time.Now().UTC()
	existedRequest.ReviewedAt = &now

	if err := s.repo.Mileage().SaveAccrualRequest(ctx, existedRequest); err != nil {
		return err
	}

	// 3. Update related customer
	if err := s.repo.Mileage().IncreaseCustomerMiles(ctx, existedRequest.CustomerID, existedRequest.QualifyingMiles, existedRequest.BonusMiles); err != nil {
		return err
	}

	// 4. Update miles ledgers
	if err := s.repo.Mileage().SaveMileageLedger(ctx, entity.MilesLedger{
		CustomerID:           existedRequest.CustomerID,
		QualifyingMilesDelta: existedRequest.QualifyingMiles,
		BonusMilesDelta:      existedRequest.BonusMiles,
		AccrualRequestID:     &existedRequest.ID,
	}); err != nil {
		return err
	}

	return nil
}

func (s service) RejectAccrualRequest(ctx context.Context, reqID int64, rejectedReason string) error {
	existedRequest, err := s.repo.Mileage().GetAccrualRequest(ctx, reqID)
	if err != nil {
		return err
	}

	if existedRequest.ID == 0 {
		return errors.New("accrual request does not exists")
	}

	if existedRequest.Status != constants.RequestStatusInProgress {
		return errors.New("invalid status")
	}

	userProfile := iam.GetUserProfileFromContext(ctx)
	userID := userProfile.ID()

	existedRequest.Status = constants.RequestStatusRejected
	existedRequest.ReviewerID = &userID
	now := time.Now().UTC()
	existedRequest.ReviewedAt = &now
	existedRequest.RejectedReason = &rejectedReason

	if err := s.repo.Mileage().SaveAccrualRequest(ctx, existedRequest); err != nil {
		return err
	}

	return nil
}

func (s service) GetMyAccrualRequests(ctx context.Context, filter dto.AccrualRequestFilter) ([]entity.AccrualRequest, int64, error) {
	userProfile := iam.GetUserProfileFromContext(ctx)

	customer, err := s.repo.Customer().GetByUserID(ctx, userProfile.ID())
	if err != nil {
		return nil, 0, err
	}

	return s.repo.Mileage().GetAccrualRequests(
		ctx,
		filter.Keyword,
		customer.ID,
		filter.Status,
		filter.SubmittedDate,
		filter.Page,
		filter.Size,
	)
}

func (s service) GetAccrualRequests(ctx context.Context, filter dto.AccrualRequestFilter) ([]entity.AccrualRequest, int64, error) {
	return s.repo.Mileage().GetAccrualRequests(
		ctx,
		filter.Keyword,
		0, // Means not filter by customer_id
		filter.Status,
		filter.SubmittedDate,
		filter.Page,
		filter.Size,
	)
}

func (s service) GetMyMileageLedgers(ctx context.Context, filter dto.MileageLedgerFilter) ([]entity.MilesLedger, int64, error) {
	userProfile := iam.GetUserProfileFromContext(ctx)

	customer, err := s.repo.Customer().GetByUserID(ctx, userProfile.ID())
	if err != nil {
		return nil, 0, err
	}

	return s.repo.Mileage().GetMileageLedgers(
		ctx,
		customer.ID,
		filter.Date,
		filter.Page,
		filter.Size,
	)
}

func (s service) GetMileageLedgers(ctx context.Context, filter dto.MileageLedgerFilter) ([]entity.MilesLedger, int64, error) {
	return s.repo.Mileage().GetMileageLedgers(
		ctx,
		0, // Means not filter by customer_id
		filter.Date,
		filter.Page,
		filter.Size,
	)
}
