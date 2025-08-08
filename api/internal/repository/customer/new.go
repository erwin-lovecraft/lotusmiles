package customer

import (
	"context"

	"github.com/erwin-lovecraft/aegismiles/internal/entity"
	"gorm.io/gorm"
)

type Repository interface {
	Save(ctx context.Context, e entity.Customer) (entity.Customer, error)

	FindByPhone(ctx context.Context, phone string) (entity.Customer, error)

	ListAll(ctx context.Context, filter Filter) ([]entity.Customer, int64, error)
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}
