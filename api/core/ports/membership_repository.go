package ports

import (
	"context"

	"github.com/erwin-lovecraft/aegismiles/internal/entity"
)

type MembershipRepository interface {
	GetCustomerQualifyingMiles(ctx context.Context, customerID string) (float64, error)
	UpdateCustomerMembershipTier(ctx context.Context, customerID string, memberTier string) error
	GetCustomerByID(ctx context.Context, customerID string) (entity.Customer, error)
	SaveMembershipHistory(ctx context.Context, history entity.MembershipHistory) error
	GetAllCustomerIDs(ctx context.Context, page, size int) ([]string, int64, error)
}
