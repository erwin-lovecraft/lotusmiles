package repository

import (
	"github.com/erwin-lovecraft/aegismiles/internal/repository/customer"
	"github.com/erwin-lovecraft/aegismiles/internal/repository/mileage"
	"gorm.io/gorm"
)

type Repository interface {
	Customer() customer.Repository
	Mileage() mileage.Repository
}

type repository struct {
	db       *gorm.DB
	customer customer.Repository
	mileage  mileage.Repository
}

func New(db *gorm.DB) Repository {
	return repository{
		db:       db,
		customer: customer.NewRepository(db),
		mileage:  mileage.NewRepository(db),
	}
}

func (r repository) Customer() customer.Repository {
	return r.customer
}

func (r repository) Mileage() mileage.Repository {
	return r.mileage
}
