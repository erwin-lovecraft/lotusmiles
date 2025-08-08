package customer

import (
	"context"

	pkgerrors "github.com/pkg/errors"

	"github.com/erwin-lovecraft/aegismiles/internal/entity"
)

func (r *repository) Save(ctx context.Context, e entity.Customer) (entity.Customer, error) {
	if err := r.db.WithContext(ctx).Save(&e).Error; err != nil {
		return entity.Customer{}, pkgerrors.WithStack(err)
	}
	return e, nil
}
