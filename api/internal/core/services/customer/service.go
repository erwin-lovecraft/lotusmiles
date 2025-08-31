package customer

import (
	"context"

	"github.com/erwin-lovecraft/lotusmiles/internal/constants"
	"github.com/erwin-lovecraft/lotusmiles/internal/core/domain"
	"github.com/erwin-lovecraft/lotusmiles/internal/core/ports"
	"github.com/google/uuid"
)

type Service interface {
	GetCustomer(ctx context.Context, userID string) (domain.Customer, error)
}

type service struct {
	repo     ports.Repository
	auth0Svc ports.AuthGateway
}

func New(repo ports.Repository, authGwy ports.AuthGateway) Service {
	return service{
		repo:     repo,
		auth0Svc: authGwy,
	}
}

func (s service) GetCustomer(ctx context.Context, userID string) (domain.Customer, error) {
	customer, err := s.repo.Customer().GetByUserID(ctx, userID)
	if err != nil {
		return domain.Customer{}, err
	}

	if customer.ID == uuid.Nil {
		data, err := s.auth0Svc.GetUser(ctx, userID)
		if err != nil {
			return domain.Customer{}, err
		}

		customer.QualifyingMilesTotal = 0
		customer.BonusMilesTotal = 0
		customer.MemberTier = constants.MemberTierRegister
		customer.Auth0UserID = userID
		customer.Email = data.Email
		customer.Phone = data.PhoneNumber
		customer.FirstName = data.GivenName
		customer.LastName = data.FamilyName

		if err := s.repo.Customer().Save(ctx, customer); err != nil {
			return domain.Customer{}, err
		}
	}

	return customer, nil
}
