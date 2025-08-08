package repository

import (
	"gorm.io/gorm"

	"github.com/erwin-lovecraft/aegismiles/internal/repository/customer"
)

type Repository interface {
	Customer() customer.Repository
}

type repository struct {
	db       *gorm.DB
	customer customer.Repository
}

func New(db *gorm.DB) Repository {
	return &repository{
		db:       db,
		customer: customer.NewRepository(db),
	}
}

func (r *repository) Customer() customer.Repository {
	return r.customer
}

func (r *repository) Transaction(fn func(r Repository) error) error {
	tx := r.db.Begin()
	if tx.Error != nil {
		return tx.Error
	}

	repo := &repository{
		db:       tx,
		customer: r.customer,
	}

	if err := fn(repo); err != nil {
		if rollbackErr := tx.Rollback().Error; rollbackErr != nil {
			return rollbackErr
		}
		return err
	}

	return tx.Commit().Error
}
