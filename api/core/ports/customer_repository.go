package ports

import (
	"context"

	"github.com/erwin-lovecraft/aegismiles/internal/entity"
)

type CustomerRepository interface {
	Save(ctx context.Context, customer entity.Customer) error
	GetByUserID(ctx context.Context, userID string) (entity.Customer, error)
	GetByID(ctx context.Context, customerID string) (entity.Customer, error)
}
