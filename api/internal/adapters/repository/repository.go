package repository

import (
	"github.com/erwin-lovecraft/lotusmiles/internal/adapters/repository/customer"
	"github.com/erwin-lovecraft/lotusmiles/internal/adapters/repository/membership"
	"github.com/erwin-lovecraft/lotusmiles/internal/adapters/repository/mileage"
	"github.com/erwin-lovecraft/lotusmiles/internal/core/ports"
	"gorm.io/gorm"
)

type repository struct {
	db         *gorm.DB
	customer   customer.Repository
	mileage    mileage.Repository
	membership membership.Repository
}

func New(db *gorm.DB) ports.Repository {
	return repository{
		db:         db,
		customer:   customer.New(db),
		mileage:    mileage.New(db),
		membership: membership.New(db),
	}
}

func (r repository) Customer() ports.CustomerRepository {
	return r.customer
}

func (r repository) Mileage() ports.MileageRepository {
	return r.mileage
}

func (r repository) Membership() ports.MembershipRepository {
	return r.membership
}
