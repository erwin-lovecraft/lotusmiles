package membership

import (
	"context"
	"fmt"
	"time"

	"github.com/erwin-lovecraft/aegismiles/internal/config"
	"github.com/erwin-lovecraft/aegismiles/internal/constants"
	"github.com/erwin-lovecraft/aegismiles/internal/entity"
	"github.com/erwin-lovecraft/aegismiles/internal/pkg/generator"
	"github.com/erwin-lovecraft/aegismiles/internal/repository"
)

type Service interface {
	CalculateAndUpdateMembershipTier(ctx context.Context, customerID string) error

	CalculateAndUpdateMembershipTierWithEffectiveMonth(ctx context.Context, customerID string, effectiveMonth time.Time) (string, float64, error)
}

type service struct {
	repo repository.Repository
	cfg  config.LoyaltyConfig
}

func New(repo repository.Repository, cfg config.LoyaltyConfig) Service {
	return service{
		repo: repo,
		cfg:  cfg,
	}
}

func (s service) CalculateAndUpdateMembershipTier(ctx context.Context, customerID string) error {
	_, _, err := s.CalculateAndUpdateMembershipTierWithEffectiveMonth(ctx, customerID, time.Now().UTC())
	return err
}

func (s service) CalculateAndUpdateMembershipTierWithEffectiveMonth(ctx context.Context, customerID string, effectiveMonth time.Time) (string, float64, error) {
	// Get current customer data
	customer, err := s.repo.Customer().GetByID(ctx, customerID)
	if err != nil {
		return "", 0, fmt.Errorf("failed to get customer: %w", err)
	}

	// Calculate rolling window qualifying miles
	rollingMiles, err := s.repo.Membership().GetRollingWindowQualifyingMiles(ctx, customerID, effectiveMonth)
	if err != nil {
		return "", 0, fmt.Errorf("failed to calculate rolling window miles: %w", err)
	}

	// Determine new tier based on rolling miles
	newTier := s.getMembershipTierForMiles(rollingMiles)

	// Only update if tier has changed
	if customer.MemberTier != newTier {
		// Update customer's membership tier
		if err := s.repo.Membership().UpdateCustomerMembershipTier(ctx, customerID, newTier); err != nil {
			return "", 0, fmt.Errorf("failed to update membership tier: %w", err)
		}

		// Save membership history
		history := entity.MembershipHistory{
			CustomerID: customerID,
			OldTier:    customer.MemberTier,
			NewTier:    newTier,
			Reason:     constants.MembershipReasonCronRecalc, // This will be overridden for accrual path
		}

		// Generate ID for the history record
		id, err := generator.MembershipHistoryID.Generate()
		if err != nil {
			return "", 0, fmt.Errorf("failed to generate history ID: %w", err)
		}
		history.ID = id

		if err := s.repo.Membership().SaveMembershipHistory(ctx, history); err != nil {
			return "", 0, fmt.Errorf("failed to save membership history: %w", err)
		}
	}

	return newTier, rollingMiles, nil
}

func (s service) getMembershipTierForMiles(qualifyingMiles float64) string {
	var highestTier string
	for _, condition := range constants.MembershipTierConditions {
		if qualifyingMiles < condition.MinMiles {
			break
		}

		highestTier = condition.Tier
	}

	return highestTier
}
