package mileage

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/erwin-lovecraft/aegismiles/internal/constants"
	"github.com/erwin-lovecraft/aegismiles/internal/core/domain"
	"github.com/erwin-lovecraft/aegismiles/internal/models/dto"
	"github.com/erwin-lovecraft/aegismiles/internal/repository"
	"github.com/google/uuid"
	"github.com/viebiz/lit/iam"
)

type Service interface {
	GetMyAccrualRequests(ctx context.Context, filter dto.AccrualRequestFilter) ([]domain.AccrualRequest, int64, error)

	GetAccrualRequests(ctx context.Context, filter dto.AccrualRequestFilter) ([]domain.AccrualRequest, int64, error)

	SubmitAccrualRequest(ctx context.Context, request dto.AccrualRequestInput) error

	ApproveAccrualRequest(ctx context.Context, reqID string) error

	RejectAccrualRequest(ctx context.Context, reqID string, rejectedReason string) error

	GetMyMileageLedgers(ctx context.Context, filter dto.MileageLedgerFilter) ([]domain.MilesLedger, int64, error)

	GetMileageLedgers(ctx context.Context, filter dto.MileageLedgerFilter) ([]domain.MilesLedger, int64, error)
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

	if customer.ID == uuid.Nil {
		return errors.New("user not found")
	}

	// 2. Check exists request exists
	existedRequest, err := s.repo.Mileage().GetAccrualRequestByFilter(ctx, customer.ID.String(), request.TicketID, request.PNR)
	if err != nil {
		return err
	}

	if existedRequest.ID != uuid.Nil {
		return errors.New("accrual request already exists")
	}

	// 2. Mapping value
	e := domain.AccrualRequest{
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

func (s service) calculateMiles(ctx context.Context, req *domain.AccrualRequest) error {
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

func (s service) ApproveAccrualRequest(ctx context.Context, reqID string) error {
	// 1. Get existed accrual request
	existedRequest, err := s.repo.Mileage().GetAccrualRequest(ctx, reqID)
	if err != nil {
		return err
	}

	if existedRequest.ID == uuid.Nil {
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

	// 3. Update related customer miles
	if err := s.repo.Mileage().IncreaseCustomerMiles(ctx, existedRequest.CustomerID.String(), existedRequest.QualifyingMiles, existedRequest.BonusMiles); err != nil {
		return err
	}

	// 4. Update miles ledgers with new fields
	earningMonth := time.Date(existedRequest.DepartureDate.Year(), existedRequest.DepartureDate.Month(), 1, 0, 0, 0, 0, existedRequest.DepartureDate.Location())
	expiresAt := earningMonth.AddDate(0, 13, 0)

	if err := s.repo.Mileage().SaveMileageLedger(ctx, domain.MilesLedger{
		CustomerID:           existedRequest.CustomerID,
		QualifyingMilesDelta: existedRequest.QualifyingMiles,
		BonusMilesDelta:      existedRequest.BonusMiles,
		AccrualRequestID:     &existedRequest.ID,
		Kind:                 "accrual",
		EarningMonth:         earningMonth,
		ExpiresAt:            &expiresAt,
		Note:                 fmt.Sprintf("Accrual for flight %s", existedRequest.TicketID),
	}); err != nil {
		return err
	}

	// 5. Check and update membership tier with current month
	//currentMonth := time.Now().UTC()
	//if _, _, err := s.membershipSvc.CalculateAndUpdateMembershipTierWithEffectiveMonth(ctx, existedRequest.CustomerID.String(), currentMonth); err != nil {
	//	return err
	//}

	return nil
}

func (s service) RejectAccrualRequest(ctx context.Context, reqID string, rejectedReason string) error {
	existedRequest, err := s.repo.Mileage().GetAccrualRequest(ctx, reqID)
	if err != nil {
		return err
	}

	if existedRequest.ID == uuid.Nil {
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

func (s service) GetMyAccrualRequests(ctx context.Context, filter dto.AccrualRequestFilter) ([]domain.AccrualRequest, int64, error) {
	userProfile := iam.GetUserProfileFromContext(ctx)

	customer, err := s.repo.Customer().GetByUserID(ctx, userProfile.ID())
	if err != nil {
		return nil, 0, err
	}

	return s.repo.Mileage().GetAccrualRequests(
		ctx,
		filter.Keyword,
		customer.ID.String(),
		filter.Status,
		filter.SubmittedDate,
		filter.Page,
		filter.Size,
	)
}

func (s service) GetAccrualRequests(ctx context.Context, filter dto.AccrualRequestFilter) ([]domain.AccrualRequest, int64, error) {
	return s.repo.Mileage().GetAccrualRequests(
		ctx,
		filter.Keyword,
		"", // Means not filter by customer_id
		filter.Status,
		filter.SubmittedDate,
		filter.Page,
		filter.Size,
	)
}

func (s service) GetMyMileageLedgers(ctx context.Context, filter dto.MileageLedgerFilter) ([]domain.MilesLedger, int64, error) {
	userProfile := iam.GetUserProfileFromContext(ctx)

	customer, err := s.repo.Customer().GetByUserID(ctx, userProfile.ID())
	if err != nil {
		return nil, 0, err
	}

	return s.repo.Mileage().GetMileageLedgers(
		ctx,
		customer.ID.String(),
		filter.Date,
		filter.Page,
		filter.Size,
	)
}

func (s service) GetMileageLedgers(ctx context.Context, filter dto.MileageLedgerFilter) ([]domain.MilesLedger, int64, error) {
	return s.repo.Mileage().GetMileageLedgers(
		ctx,
		"", // Means not filter by customer_id
		filter.Date,
		filter.Page,
		filter.Size,
	)
}
