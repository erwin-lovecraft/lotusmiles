package customer

import (
	"context"
	"errors"

	"github.com/erwin-lovecraft/aegismiles/internal/entity"
	"github.com/erwin-lovecraft/aegismiles/internal/pkg/generator"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Repository interface {
	Save(ctx context.Context, customer entity.Customer) error

	GetByUserID(ctx context.Context, userID string) (entity.Customer, error)

	GetByID(ctx context.Context, customerID string) (entity.Customer, error)
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return repository{db: db}
}

func (r repository) Save(ctx context.Context, customer entity.Customer) error {
	if customer.ID == uuid.Nil {
		customerID, err := generator.CustomerID.Generate()
		if err != nil {
			return err
		}
		customer.ID = customerID
	}

	return r.db.WithContext(ctx).Save(&customer).Error
}

func (r repository) GetByUserID(ctx context.Context, userID string) (entity.Customer, error) {
	var customer entity.Customer
	if err := r.db.WithContext(ctx).Where("auth0_user_id = ?", userID).First(&customer).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return entity.Customer{}, nil
		}
		return entity.Customer{}, err
	}
	return customer, nil
}

func (r repository) GetByID(ctx context.Context, customerID string) (entity.Customer, error) {
	var customer entity.Customer
	if err := r.db.WithContext(ctx).Where("id = ?", customerID).First(&customer).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return entity.Customer{}, nil
		}
		return entity.Customer{}, err
	}
	return customer, nil
}
