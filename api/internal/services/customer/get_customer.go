package customer

import (
	"context"

	"github.com/erwin-lovecraft/aegismiles/internal/entity"
)

func (s *service) GetCustomerProfile(ctx context.Context, userID string) (entity.Customer, error) {
	// Get customer from repository
	customer, err := s.repo.Customer().FindByExternalID(ctx, userID)
	if err != nil {
		return entity.Customer{}, err
	}

	// If customer already exists in DB return it
	if customer.ID != 0 {
		return customer, nil
	}

	// If customer not found on BD
	// Retrieve from Auth0 and persist to DB
	userProfile, err := s.auth0Client.GetUser(ctx, userID)
	if err != nil {
		return entity.Customer{}, err
	}

	customer, err = s.repo.Customer().Save(ctx, entity.Customer{
		ExternalID: userProfile.UserID,
		FirstName:  userProfile.GivenName,
		LastName:   userProfile.FamilyName,
		Email:      userProfile.Email,
		Phone:      userProfile.PhoneNumber,
	})
	if err != nil {
		return entity.Customer{}, err
	}

	return customer, nil
}
