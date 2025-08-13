package user

import (
	"context"
	"errors"

	"github.com/erwin-lovecraft/aegismiles/internal/entity"
	pkgerrors "github.com/pkg/errors"
	"gorm.io/gorm"
)

type Repository interface {
	FindByExternalID(ctx context.Context, externalID string) (entity.User, error)
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

func (r *repository) FindByExternalID(ctx context.Context, externalID string) (entity.User, error) {
	var user entity.User
	if err := r.db.WithContext(ctx).First(&user, "idp_user_id = ?", externalID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return entity.User{}, nil
		}
		return entity.User{}, pkgerrors.WithStack(err)
	}
	return user, nil
}
