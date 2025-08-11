package customer

import (
	"context"

	"github.com/erwin-lovecraft/aegismiles/internal/entity"
	"github.com/erwin-lovecraft/aegismiles/internal/models/dto"
	"github.com/viebiz/lit/iam"
)

func (s *service) OnboardCustomer(ctx context.Context, req dto.OnboardCustomer) (entity.Customer, error) {
	// 1. Get Current User from ctx
	userProfile := iam.GetUserProfileFromContext(ctx)

	// 2. Find exists customer by profile_id
	existedCustomer, err := s.repo.Customer().FindByExternalID(ctx, userProfile.ID())
	if err != nil {
		return entity.Customer{}, err
	}

	// 3. Return error if user already onboard
	if existedCustomer.Onboarded == true {
		return entity.Customer{}, ErrCustomerAlreadyOnboard
	}

	// TODO: Check referrer_code if it exists

	existedCustomer.Onboarded = true
	existedCustomer.Phone = &req.Phone
	existedCustomer.FirstName = req.FirstName
	existedCustomer.LastName = req.LastName
	if req.Address != nil {
		existedCustomer.Address = *req.Address
	}

	// 3. Save customer
	savedCustomer, err := s.repo.Customer().Save(ctx, existedCustomer)
	if err != nil {
		return entity.Customer{}, err
	}

	return savedCustomer, nil
}
