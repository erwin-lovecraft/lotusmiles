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

	// TODO: Check referrer_code if it exists

	existedCustomer.Onboarded = true
	existedCustomer.Phone = req.Phone
	existedCustomer.Email = req.Email
	existedCustomer.FirstName = req.FirstName
	existedCustomer.LastName = req.LastName
	
	// 3. Save customer
	savedCustomer, err := s.repo.Customer().Save(ctx, existedCustomer)
	if err != nil {
		return entity.Customer{}, err
	}

	return savedCustomer, nil
}
