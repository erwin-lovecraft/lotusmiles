package customer

import (
	"context"

	"github.com/erwin-lovecraft/aegismiles/internal/entity"
	"github.com/erwin-lovecraft/aegismiles/internal/models/dto"
	"github.com/erwin-lovecraft/aegismiles/internal/repository"
)

type Service interface {
	CreateCustomer(ctx context.Context, req dto.CreateCustomer) (entity.Customer, error)

	ListCustomers(ctx context.Context, filter dto.CustomerFilter) ([]entity.Customer, int64, error)
}

type service struct {
	repo repository.Repository
}

func New(repo repository.Repository) Service {
	return &service{
		repo: repo,
	}
}
