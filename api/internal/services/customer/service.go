package customer

import (
	"context"

	"github.com/erwin-lovecraft/aegismiles/internal/constants"
	"github.com/erwin-lovecraft/aegismiles/internal/entity"
	"github.com/erwin-lovecraft/aegismiles/internal/gateway/auth0"
	"github.com/erwin-lovecraft/aegismiles/internal/repository"
)

type Service interface {
	GetCustomer(ctx context.Context, userID string) (entity.Customer, error)
}

type service struct {
	repo     repository.Repository
	auth0Svc auth0.Client
}

func New(repo repository.Repository, authGwy auth0.Client) Service {
	return service{
		repo:     repo,
		auth0Svc: authGwy,
	}
}

func (s service) GetCustomer(ctx context.Context, userID string) (entity.Customer, error) {
	customer, err := s.repo.Customer().GetByUserID(ctx, userID)
	if err != nil {
		return entity.Customer{}, err
	}

	if customer.ID == 0 {
		data, err := s.auth0Svc.GetUser(ctx, userID)
		if err != nil {
			return entity.Customer{}, err
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
			return entity.Customer{}, err
		}
	}

	return customer, nil
}
