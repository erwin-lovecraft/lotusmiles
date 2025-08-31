package customer

import (
	"context"

	"github.com/erwin-lovecraft/aegismiles/internal/config"
	"github.com/erwin-lovecraft/aegismiles/internal/core/domain"
	"github.com/erwin-lovecraft/aegismiles/internal/gateway/auth0"
	"github.com/erwin-lovecraft/aegismiles/internal/gateway/sessionm"
	"github.com/erwin-lovecraft/aegismiles/internal/models/dto"
	"github.com/erwin-lovecraft/aegismiles/internal/repository"
	"github.com/google/uuid"
)

type v2service struct {
	cfg         config.SessionMConfig
	repo        repository.Repository
	auth0Svc    auth0.Client
	sessionmSvc sessionm.Client
}

func NewV2(cfg config.SessionMConfig, repo repository.Repository, authGwy auth0.Client, sessionmGwy sessionm.Client) Service {
	return v2service{
		cfg:         cfg,
		repo:        repo,
		auth0Svc:    authGwy,
		sessionmSvc: sessionmGwy,
	}
}

func (s v2service) GetCustomer(ctx context.Context, userID string) (domain.Customer, error) {
	customer, err := s.sessionmSvc.GetUser(ctx, userID)
	if err != nil {
		return domain.Customer{}, err
	}

	if customer.ID == uuid.Nil {
		auth0Data, err := s.auth0Svc.GetUser(ctx, userID)
		if err != nil {
			return domain.Customer{}, err
		}

		sessionMRequest := dto.SessionMCreateUserRequest{
			User: dto.SessionMCreateUserData{
				ExternalID:     userID,
				OptedIn:        "true",
				ExternalIDType: "lotusmiles",
				Email:          auth0Data.Email,
				FirstName:      auth0Data.GivenName,
				LastName:       auth0Data.FamilyName,
			},
		}

		if auth0Data.PhoneNumber != "" {
			sessionMRequest.User.PhoneNumbers = []dto.SessionMPhoneNumber{
				{
					PhoneNumber:     auth0Data.PhoneNumber,
					PhoneType:       "mobile",
					PreferenceFlags: []string{"primary"},
				},
			}
		}

		customer, err = s.sessionmSvc.CreateUser(ctx, sessionMRequest)
		if err != nil {
			return domain.Customer{}, err
		}
	}

	rs := convertCustomerEntity(s.cfg, customer)
	if err := s.repo.Customer().Save(ctx, rs); err != nil {
		return domain.Customer{}, err
	}

	return rs, nil
}

func convertMemberTier(tier string) string {
	tierNameMap := map[string]string{
		"[Team-1] Silver":        "silver",
		"[Team-1] Titan":         "titan",
		"[Team-1] Gold":          "gold",
		"[Team-1] Platinum":      "platinum",
		"[Team-1] Million Miler": "million_miler",
	}

	if tierName, exists := tierNameMap[tier]; exists {
		return tierName
	}

	return "register"
}

func convertCustomerEntity(cfg config.SessionMConfig, customer dto.SessionMUserProfile) domain.Customer {
	rs := domain.Customer{
		ID:                   customer.ID,
		QualifyingMilesTotal: customer.TierPoints,
		BonusMilesTotal:      customer.TestPoints,
		Auth0UserID:          customer.ExternalID,
		Email:                customer.Email,
		FirstName:            customer.FirstName,
		LastName:             customer.LastName,
		MemberTier:           "register",
	}
	// TODO: Add phone

	for _, tierLevel := range customer.TierDetails.TierLevels {
		if tierLevel.TierSystemID == cfg.TierSystemID {
			rs.MemberTier = convertMemberTier(tierLevel.TierOverview.Name)
		}
	}

	for _, detail := range customer.TierDetails.PointAccountBalances.Details {
		if detail.PointAccountID == cfg.PointAccountID {
			rs.QualifyingMilesTotal = detail.AvailableBalance
		}
	}

	return rs
}
