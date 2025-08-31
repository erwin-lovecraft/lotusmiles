package repository

import (
	"github.com/erwin-lovecraft/aegismiles/internal/core/ports"
	"github.com/erwin-lovecraft/aegismiles/internal/repository/customer"
	"github.com/erwin-lovecraft/aegismiles/internal/repository/membership"
	"github.com/erwin-lovecraft/aegismiles/internal/repository/mileage"
	"gorm.io/gorm"
)

type repository struct {
	db         *gorm.DB
	customer   ports.CustomerRepository
	mileage    ports.MileageRepository
	membership ports.MembershipRepository
}

func New(db *gorm.DB) ports.Repository {
	return repository{
		db:         db,
		customer:   customer.NewRepository(db),
		mileage:    mileage.NewRepository(db),
		membership: membership.NewRepository(db),
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
