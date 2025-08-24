package mileage

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/erwin-lovecraft/aegismiles/internal/config"
	"github.com/erwin-lovecraft/aegismiles/internal/constants"
	"github.com/erwin-lovecraft/aegismiles/internal/entity"
	"github.com/erwin-lovecraft/aegismiles/internal/models/dto"
	"github.com/erwin-lovecraft/aegismiles/internal/repository"
	"github.com/erwin-lovecraft/aegismiles/internal/services/membership"
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

	ExpireQualifyingMilesForMonth(ctx context.Context, monthToExpire time.Time) error
}

type service struct {
	repo          repository.Repository
	membershipSvc membership.Service
	cfg           config.LoyaltyConfig
}

func New(repo repository.Repository, membershipSvc membership.Service, cfg config.LoyaltyConfig) Service {
	return service{
		repo:          repo,
		membershipSvc: membershipSvc,
		cfg:           cfg,
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

	// 3. Update related customer miles
	if err := s.repo.Mileage().IncreaseCustomerMiles(ctx, existedRequest.CustomerID, existedRequest.QualifyingMiles, existedRequest.BonusMiles); err != nil {
		return err
	}

	// 4. Update miles ledgers with new fields
	earningMonth := time.Date(existedRequest.DepartureDate.Year(), existedRequest.DepartureDate.Month(), 1, 0, 0, 0, 0, existedRequest.DepartureDate.Location())
	expirePeriod := time.Duration(s.cfg.ExpirePeriodMinutes) * time.Minute
	expiresAt := earningMonth.Add(expirePeriod)

	if err := s.repo.Mileage().SaveMileageLedger(ctx, entity.MilesLedger{
		CustomerID:           existedRequest.CustomerID,
		QualifyingMilesDelta: existedRequest.QualifyingMiles,
		BonusMilesDelta:      existedRequest.BonusMiles,
		AccrualRequestID:     &existedRequest.ID,
		Kind:                 constants.LedgerKindAccrual,
		EarningMonth:         earningMonth,
		ExpiresAt:            &expiresAt,
		Note:                 fmt.Sprintf("Accrual for flight %s", existedRequest.TicketID),
	}); err != nil {
		return err
	}

	// 5. Check and update membership tier with current month
	currentMonth := time.Now().UTC()
	if _, _, err := s.membershipSvc.CalculateAndUpdateMembershipTierWithEffectiveMonth(ctx, existedRequest.CustomerID, currentMonth); err != nil {
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

// ExpireQualifyingMilesForMonth expires qualifying miles for the specified month
func (s service) ExpireQualifyingMilesForMonth(ctx context.Context, monthToExpire time.Time) error {
	// Get customers with positive QM deltas for the month
	customerIDs, err := s.repo.Mileage().GetCustomersWithPositiveQMDeltasForMonth(ctx, monthToExpire)
	if err != nil {
		return fmt.Errorf("failed to get customers with positive QM deltas: %w", err)
	}

	var totalExpired float64
	var affectedCustomers int

	// Process each customer
	for _, customerID := range customerIDs {
		// Check if expire record already exists (idempotency)
		exists, err := s.repo.Mileage().CheckExpireRecordExists(ctx, customerID, monthToExpire)
		if err != nil {
			return fmt.Errorf("failed to check expire record for customer %d: %w", customerID, err)
		}

		if exists {
			continue // Skip if already processed
		}

		// Calculate total QM deltas for the month
		totalDeltas, err := s.repo.Mileage().GetTotalQMDeltasForCustomerAndMonth(ctx, customerID, monthToExpire)
		if err != nil {
			return fmt.Errorf("failed to get total QM deltas for customer %d: %w", customerID, err)
		}

		if totalDeltas <= 0 {
			continue // No positive miles to expire
		}

		// Create expire ledger entry
		currentMonth := time.Now().UTC()
		expireLedger := entity.MilesLedger{
			CustomerID:           customerID,
			QualifyingMilesDelta: -totalDeltas, // Negative to expire
			BonusMilesDelta:      0,
			Kind:                 constants.LedgerKindExpire,
			EarningMonth:         currentMonth,
			Note:                 fmt.Sprintf("expire QM for %s", monthToExpire.Format("2006-01")),
		}

		if err := s.repo.Mileage().SaveMileageLedger(ctx, expireLedger); err != nil {
			return fmt.Errorf("failed to save expire ledger for customer %d: %w", customerID, err)
		}

		// Update customer's total qualifying miles
		if err := s.repo.Mileage().IncreaseCustomerMiles(ctx, customerID, -totalDeltas, 0); err != nil {
			return fmt.Errorf("failed to update customer miles for customer %d: %w", customerID, err)
		}

		totalExpired += totalDeltas
		affectedCustomers++
	}

	// Log the results
	fmt.Printf("Expired %.2f qualifying miles for %d customers in month %s\n",
		totalExpired, affectedCustomers, monthToExpire.Format("2006-01"))

	return nil
}
