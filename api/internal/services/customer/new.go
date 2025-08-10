package customer

import (
	"context"

	"github.com/erwin-lovecraft/aegismiles/internal/entity"
	"github.com/erwin-lovecraft/aegismiles/internal/gateway/auth0"
	"github.com/erwin-lovecraft/aegismiles/internal/models/dto"
	"github.com/erwin-lovecraft/aegismiles/internal/repository"
)

type Service interface {
	OnboardCustomer(ctx context.Context, req dto.OnboardCustomer) (entity.Customer, error)

	GetCustomerProfile(ctx context.Context, userID string) (entity.Customer, error)

	ListCustomers(ctx context.Context, filter dto.CustomerFilter) ([]entity.Customer, int64, error)
}

type service struct {
	repo        repository.Repository
	auth0Client auth0.Client
}

func New(repo repository.Repository, auth0Client auth0.Client) Service {
	return &service{
		repo:        repo,
		auth0Client: auth0Client,
	}
}
