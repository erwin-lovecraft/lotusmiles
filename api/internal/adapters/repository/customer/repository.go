package customer

import (
	"context"
	"errors"

	"github.com/erwin-lovecraft/lotusmiles/internal/core/domain"
	"github.com/erwin-lovecraft/lotusmiles/internal/core/ports"
	"github.com/erwin-lovecraft/lotusmiles/internal/pkg/generator"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Repository interface {
	Save(ctx context.Context, customer domain.Customer) error

	GetByUserID(ctx context.Context, userID string) (domain.Customer, error)

	GetByID(ctx context.Context, customerID string) (domain.Customer, error)
}

type repository struct {
	db *gorm.DB
}

func New(db *gorm.DB) ports.CustomerRepository {
	return repository{db: db}
}

func (r repository) Save(ctx context.Context, customer domain.Customer) error {
	if customer.ID == uuid.Nil {
		customerID, err := generator.CustomerID.Generate()
		if err != nil {
			return err
		}
		customer.ID = customerID
	}

	return r.db.WithContext(ctx).Save(&customer).Error
}

func (r repository) GetByUserID(ctx context.Context, userID string) (domain.Customer, error) {
	var customer domain.Customer
	if err := r.db.WithContext(ctx).Where("auth0_user_id = ?", userID).First(&customer).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return domain.Customer{}, nil
		}
		return domain.Customer{}, err
	}
	return customer, nil
}

func (r repository) GetByID(ctx context.Context, customerID string) (domain.Customer, error) {
	var customer domain.Customer
	if err := r.db.WithContext(ctx).Where("id = ?", customerID).First(&customer).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return domain.Customer{}, nil
		}
		return domain.Customer{}, err
	}
	return customer, nil
}

var _ ports.CustomerRepository = (*repository)(nil)
