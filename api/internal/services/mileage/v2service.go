package mileage

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/erwin-lovecraft/aegismiles/internal/config"
	"github.com/erwin-lovecraft/aegismiles/internal/constants"
	"github.com/erwin-lovecraft/aegismiles/internal/core/domain"
	"github.com/erwin-lovecraft/aegismiles/internal/gateway/sessionm"
	"github.com/erwin-lovecraft/aegismiles/internal/models/dto"
	"github.com/erwin-lovecraft/aegismiles/internal/repository"
	"github.com/google/uuid"
	"github.com/viebiz/lit/iam"
)

type serviceV2 struct {
	service

	cfg         config.SessionMConfig
	sessionmSvc sessionm.Client
}

func NewV2(cfg config.SessionMConfig, sessionmGwy sessionm.Client, repo repository.Repository) Service {
	return serviceV2{
		cfg:         cfg,
		sessionmSvc: sessionmGwy,
		service: service{
			repo: repo,
		},
	}
}

func (s serviceV2) ApproveAccrualRequest(ctx context.Context, reqID string) error {
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

	// 3. Deposit points to sessionm
	if _, err := s.sessionmSvc.DepositPoints(ctx, dto.SessionMDepositPointsRequest{
		RetailerID:             s.cfg.RetailerID,
		UserID:                 existedRequest.CustomerID.String(),
		AllowPartialSuccess:    false,
		DisableEventPublishing: false,
		Culture:                "en-US",
		DepositDetails: []dto.SessionMDepositDetail{
			{
				PointSourceID:  s.cfg.PointSourceID,
				PointAccountID: s.cfg.PointAccountID,
				Amount:         existedRequest.QualifyingMiles,
				ReferenceID:    existedRequest.ID.String(),
				ReferenceType:  "accrual_request",
			},
			// TODO: Bonus miles
		},
	}); err != nil {
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

	return nil
}
