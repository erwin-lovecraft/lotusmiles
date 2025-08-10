package customer

import (
	"context"
	"fmt"

	"github.com/erwin-lovecraft/aegismiles/internal/entity"
	"github.com/viebiz/lit/iam"
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

	userProfile := iam.GetUserProfileFromContext(ctx).GetProfile()
	if userProfile == nil {
		return entity.Customer{}, ErrUserProfileEmpty
	}

	customer.ExternalID = getStringValue(userProfile["user_id"])
	customer.FirstName = getStringValue(userProfile["first_name"])
	customer.LastName = getStringValue(userProfile["family_name"])
	customer.Email = getStringValue(userProfile["email"])
	if v, exists := userProfile["phone_number"]; exists {
		phoneNumber := v.(string)
		customer.Phone = &phoneNumber
	}

	customer, err = s.repo.Customer().Save(ctx, customer)
	if err != nil {
		return entity.Customer{}, err
	}

	return customer, nil
}

func getStringValue(v interface{}) string {
	if v == nil {
		return ""
	}
	return fmt.Sprintf("%v", v)
}
