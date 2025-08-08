package customer

import (
	"context"

	"github.com/erwin-lovecraft/aegismiles/internal/entity"
	"github.com/erwin-lovecraft/aegismiles/internal/models/dto"
	"github.com/erwin-lovecraft/aegismiles/internal/pkg/generator"
)

func (s *service) CreateCustomer(ctx context.Context, req dto.CreateCustomer) (entity.Customer, error) {
	c, err := s.repo.Customer().FindByPhone(ctx, req.Phone)
	if err != nil {
		return entity.Customer{}, err
	}

	if c.ID != 0 {
		return entity.Customer{}, ErrCustomerAlreadyExists
	}

	newID, err := generator.CustomerID.Generate()
	if err != nil {
		return entity.Customer{}, err
	}

	savedCustomer, err := s.repo.Customer().Save(ctx, entity.Customer{
		ID:        newID,
		FirstName: req.FirstName,
		LastName:  req.LastName,
		Email:     req.Email,
		Phone:     req.Phone,
	})
	if err != nil {
		return entity.Customer{}, err
	}

	return savedCustomer, nil
}
