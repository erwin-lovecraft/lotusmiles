package customer

import (
	"context"
	"errors"

	"github.com/erwin-lovecraft/aegismiles/internal/entity"
	pkgerrors "github.com/pkg/errors"
	"gorm.io/gorm"
)

func (r *repository) FindByPhone(ctx context.Context, phone string) (entity.Customer, error) {
	var customer entity.Customer
	if err := r.db.WithContext(ctx).First(&customer, "phone = ?", phone).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return entity.Customer{}, nil
		}

		return entity.Customer{}, pkgerrors.WithStack(err)
	}
	return customer, nil
}
