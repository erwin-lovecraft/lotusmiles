package membership

import (
	"context"

	"github.com/erwin-lovecraft/lotusmiles/internal/core/domain"
	"github.com/erwin-lovecraft/lotusmiles/internal/core/ports"
	"gorm.io/gorm"
)

type Repository interface {
	GetCustomerQualifyingMiles(ctx context.Context, customerID string) (float64, error)

	UpdateCustomerMembershipTier(ctx context.Context, customerID string, memberTier string) error

	GetCustomerByID(ctx context.Context, customerID string) (domain.Customer, error)

	SaveMembershipHistory(ctx context.Context, history domain.MembershipHistory) error

	GetAllCustomerIDs(ctx context.Context, page, size int) ([]string, int64, error)
}

type repository struct {
	db *gorm.DB
}

func New(db *gorm.DB) ports.MembershipRepository {
	return repository{
		db: db,
	}
}

func (r repository) GetCustomerQualifyingMiles(ctx context.Context, customerID string) (float64, error) {
	var customer domain.Customer
	if err := r.db.WithContext(ctx).Select("qualifying_miles_total").Where("id = ?", customerID).First(&customer).Error; err != nil {
		return 0, err
	}
	return customer.QualifyingMilesTotal, nil
}

func (r repository) UpdateCustomerMembershipTier(ctx context.Context, customerID string, memberTier string) error {
	if err := r.db.WithContext(ctx).Model(domain.Customer{}).Update("member_tier", memberTier).Where("id = ?", customerID).Error; err != nil {
		return err
	}
	return nil
}

func (r repository) GetCustomerByID(ctx context.Context, customerID string) (domain.Customer, error) {
	var customer domain.Customer
	if err := r.db.WithContext(ctx).Where("id = ?", customerID).First(&customer).Error; err != nil {
		return domain.Customer{}, err
	}
	return customer, nil
}

func (r repository) SaveMembershipHistory(ctx context.Context, history domain.MembershipHistory) error {
	return r.db.WithContext(ctx).Save(&history).Error
}

func (r repository) GetAllCustomerIDs(ctx context.Context, page, size int) ([]string, int64, error) {
	var customerIDs []string
	var total int64

	// Get total count
	if err := r.db.WithContext(ctx).Model(&domain.Customer{}).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Get paginated customer IDs
	offset := (page - 1) * size
	err := r.db.WithContext(ctx).
		Model(&domain.Customer{}).
		Select("id").
		Offset(offset).
		Limit(size).
		Find(&customerIDs).Error

	return customerIDs, total, err
}

var _ ports.MembershipRepository = (*repository)(nil)
