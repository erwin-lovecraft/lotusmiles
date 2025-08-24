package repository

import (
	"github.com/erwin-lovecraft/aegismiles/internal/config"
	"github.com/erwin-lovecraft/aegismiles/internal/repository/customer"
	"github.com/erwin-lovecraft/aegismiles/internal/repository/membership"
	"github.com/erwin-lovecraft/aegismiles/internal/repository/mileage"
	"gorm.io/gorm"
)

type Repository interface {
	Customer() customer.Repository
	Mileage() mileage.Repository
	Membership() membership.Repository
}

type repository struct {
	db         *gorm.DB
	customer   customer.Repository
	mileage    mileage.Repository
	membership membership.Repository
}

func New(db *gorm.DB, cfg config.LoyaltyConfig) Repository {
	return repository{
		db:         db,
		customer:   customer.NewRepository(db),
		mileage:    mileage.NewRepository(db),
		membership: membership.NewRepository(db, cfg),
	}
}

func (r repository) Customer() customer.Repository {
	return r.customer
}

func (r repository) Mileage() mileage.Repository {
	return r.mileage
}

func (r repository) Membership() membership.Repository {
	return r.membership
}
