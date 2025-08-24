package membership

import (
	"context"
	"time"

	"github.com/erwin-lovecraft/aegismiles/internal/config"
	"github.com/erwin-lovecraft/aegismiles/internal/entity"
	"gorm.io/gorm"
)

type Repository interface {
	GetCustomerQualifyingMiles(ctx context.Context, customerID int64) (float64, error)

	UpdateCustomerMembershipTier(ctx context.Context, customerID int64, memberTier string) error

	GetCustomerByID(ctx context.Context, customerID int64) (entity.Customer, error)

	GetRollingWindowQualifyingMiles(ctx context.Context, customerID int64, effectiveMonth time.Time) (float64, error)

	SaveMembershipHistory(ctx context.Context, history entity.MembershipHistory) error

	GetAllCustomerIDs(ctx context.Context, page, size int) ([]int64, int64, error)
}

type repository struct {
	db  *gorm.DB
	cfg config.LoyaltyConfig
}

func NewRepository(db *gorm.DB, cfg config.LoyaltyConfig) Repository {
	return repository{
		db:  db,
		cfg: cfg,
	}
}

func (r repository) GetCustomerQualifyingMiles(ctx context.Context, customerID int64) (float64, error) {
	var customer entity.Customer
	if err := r.db.WithContext(ctx).Select("qualifying_miles_total").Where("id = ?", customerID).First(&customer).Error; err != nil {
		return 0, err
	}
	return customer.QualifyingMilesTotal, nil
}

func (r repository) UpdateCustomerMembershipTier(ctx context.Context, customerID int64, memberTier string) error {
	if err := r.db.WithContext(ctx).Model(entity.Customer{ID: customerID}).Update("member_tier", memberTier).Error; err != nil {
		return err
	}
	return nil
}

func (r repository) GetCustomerByID(ctx context.Context, customerID int64) (entity.Customer, error) {
	var customer entity.Customer
	if err := r.db.WithContext(ctx).Where("id = ?", customerID).First(&customer).Error; err != nil {
		return entity.Customer{}, err
	}
	return customer, nil
}

func (r repository) GetRollingWindowQualifyingMiles(ctx context.Context, customerID int64, effectiveMonth time.Time) (float64, error) {
	// Calculate rolling window based on configured period
	rollingWindowPeriod := time.Duration(r.cfg.RollingWindowPeriodMinutes) * time.Minute
	startDate := effectiveMonth.Add(-rollingWindowPeriod)
	endDate := effectiveMonth

	var total float64
	err := r.db.WithContext(ctx).
		Model(&entity.MilesLedger{}).
		Where("customer_id = ? AND earning_month >= ? AND earning_month < ?",
			customerID, startDate, endDate).
		Select("COALESCE(SUM(qualifying_miles_delta), 0)").
		Scan(&total).Error

	return total, err
}

func (r repository) SaveMembershipHistory(ctx context.Context, history entity.MembershipHistory) error {
	return r.db.WithContext(ctx).Save(&history).Error
}

func (r repository) GetAllCustomerIDs(ctx context.Context, page, size int) ([]int64, int64, error) {
	var customerIDs []int64
	var total int64

	// Get total count
	if err := r.db.WithContext(ctx).Model(&entity.Customer{}).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Get paginated customer IDs
	offset := (page - 1) * size
	err := r.db.WithContext(ctx).
		Model(&entity.Customer{}).
		Select("id").
		Offset(offset).
		Limit(size).
		Find(&customerIDs).Error

	return customerIDs, total, err
}
