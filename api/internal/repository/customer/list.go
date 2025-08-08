package customer

import (
	"context"

	"github.com/erwin-lovecraft/aegismiles/internal/entity"
	"github.com/erwin-lovecraft/aegismiles/internal/pkg/pagination"
	pkgerrors "github.com/pkg/errors"
)

type Filter struct {
	Name       string
	Email      string
	Phone      string
	Pagination pagination.Pagination
}

func (r *repository) ListAll(ctx context.Context, filter Filter) ([]entity.Customer, int64, error) {
	query := r.db.WithContext(ctx).Model(&entity.Customer{})
	if filter.Name != "" {
		query = query.Where("first_name || last_name LIKE ?", "%"+filter.Name+"%")
	}
	if filter.Email != "" {
		query = query.Where("email = ?", filter.Email)
	}
	if filter.Phone != "" {
		query = query.Where("phone = ?", filter.Phone)
	}

	var total int64
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, pkgerrors.WithStack(err)
	}

	offset, limit := pagination.ToSQLOffsetLimit(filter.Pagination)
	query = query.Offset(offset).Limit(limit)

	var customers []entity.Customer
	if err := query.Find(&customers).Error; err != nil {
		return nil, 0, pkgerrors.WithStack(err)
	}

	return customers, total, nil
}
