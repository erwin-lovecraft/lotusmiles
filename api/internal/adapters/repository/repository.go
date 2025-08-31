package repository

import (
	"github.com/erwin-lovecraft/aegismiles/core/ports"
	customerpostgres "github.com/erwin-lovecraft/aegismiles/internal/adapters/repository/customer"
	membershippostgres "github.com/erwin-lovecraft/aegismiles/internal/adapters/repository/membership"
	mileagepostgres "github.com/erwin-lovecraft/aegismiles/internal/adapters/repository/mileage"
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
		customer:   customerpostgres.New(db),
		mileage:    mileagepostgres.New(db),
		membership: membershippostgres.New(db),
	}
}

func (r repository) Customer() ports.CustomerRepository { return r.customer }

func (r repository) Mileage() ports.MileageRepository { return r.mileage }

func (r repository) Membership() ports.MembershipRepository { return r.membership }

var _ ports.Repository = (*repository)(nil)
