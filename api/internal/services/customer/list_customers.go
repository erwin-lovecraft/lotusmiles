package customer

import (
	"context"

	"github.com/erwin-lovecraft/aegismiles/internal/entity"
	"github.com/erwin-lovecraft/aegismiles/internal/models/dto"
	"github.com/erwin-lovecraft/aegismiles/internal/repository/customer"
)

func (s *service) ListCustomers(ctx context.Context, filter dto.CustomerFilter) ([]entity.Customer, int64, error) {
	customers, total, err := s.repo.Customer().ListAll(ctx, customer.Filter{
		Name:       filter.Name,
		Email:      filter.Email,
		Phone:      filter.Phone,
		Pagination: filter.Pagination,
	})
	if err != nil {
		return nil, 0, err
	}

	return customers, total, nil
}
