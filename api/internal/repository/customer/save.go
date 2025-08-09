package customer

import (
	"context"

	"github.com/erwin-lovecraft/aegismiles/internal/pkg/generator"
	pkgerrors "github.com/pkg/errors"

	"github.com/erwin-lovecraft/aegismiles/internal/entity"
)

func (r *repository) Save(ctx context.Context, e entity.Customer) (entity.Customer, error) {
	// Generate new ID if unexists customer
	if e.ID == 0 {
		id, err := generator.CustomerID.Generate()
		if err != nil {
			return entity.Customer{}, err
		}
		e.ID = id
	}

	if err := r.db.WithContext(ctx).Save(&e).Error; err != nil {
		return entity.Customer{}, pkgerrors.WithStack(err)
	}
	return e, nil
}
