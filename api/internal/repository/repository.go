package repository

import (
	"gorm.io/gorm"

	"github.com/erwin-lovecraft/aegismiles/internal/repository/customer"
	"github.com/erwin-lovecraft/aegismiles/internal/repository/mileage_accrual_request"
	"github.com/erwin-lovecraft/aegismiles/internal/repository/user"
)

type Repository interface {
	Customer() customer.Repository
	MileageAccrualRequest() mileage_accrual_request.Repository
    User() user.Repository
}

type repository struct {
	db                    *gorm.DB
	customer              customer.Repository
	mileageAccrualRequest mileage_accrual_request.Repository
    userRepo              user.Repository
}

func New(db *gorm.DB) Repository {
	return &repository{
		db:                    db,
		customer:              customer.NewRepository(db),
		mileageAccrualRequest: mileage_accrual_request.NewRepository(db),
        userRepo:              user.NewRepository(db),
	}
}

func (r *repository) Customer() customer.Repository {
	return r.customer
}

func (r *repository) MileageAccrualRequest() mileage_accrual_request.Repository {
	return r.mileageAccrualRequest
}

func (r *repository) User() user.Repository {
    return r.userRepo
}

func (r *repository) Transaction(fn func(r Repository) error) error {
	tx := r.db.Begin()
	if tx.Error != nil {
		return tx.Error
	}

	repo := &repository{
		db:                    tx,
		customer:              r.customer,
		mileageAccrualRequest: r.mileageAccrualRequest,
        userRepo:              r.userRepo,
	}

	if err := fn(repo); err != nil {
		if rollbackErr := tx.Rollback().Error; rollbackErr != nil {
			return rollbackErr
		}
		return err
	}

	return tx.Commit().Error
}
