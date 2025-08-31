package mileage

import (
	"context"
	"errors"
	"time"

	"github.com/erwin-lovecraft/aegismiles/internal/core/domain"
	"github.com/erwin-lovecraft/aegismiles/internal/core/ports"
	"github.com/erwin-lovecraft/aegismiles/internal/pkg/generator"
	"github.com/erwin-lovecraft/aegismiles/internal/pkg/pagination"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Repository interface {
	GetAccrualRequests(ctx context.Context, keyword string, customerID string, status string, submittedDate time.Time, page int, size int) ([]domain.AccrualRequest, int64, error)

	GetAccrualRequestByFilter(ctx context.Context, customerID string, ticketID string, pnr string) (domain.AccrualRequest, error)

	GetTravelDistance(ctx context.Context, fromCode string, toCode string) (domain.TravelDistance, error)

	SaveAccrualRequest(ctx context.Context, accrualRequest domain.AccrualRequest) error

	GetAccrualRequest(ctx context.Context, id string) (domain.AccrualRequest, error)

	IncreaseCustomerMiles(ctx context.Context, customerID string, qMiles float64, bMiles float64) error

	SaveMileageLedger(ctx context.Context, e domain.MilesLedger) error

	GetMileageLedgers(ctx context.Context, customerID string, date time.Time, page int, size int) ([]domain.MilesLedger, int64, error)

	GetCustomersWithPositiveQMDeltasForMonth(ctx context.Context, monthToExpire time.Time) ([]int64, error)

	GetTotalQMDeltasForCustomerAndMonth(ctx context.Context, customerID string, monthToExpire time.Time) (float64, error)
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) ports.MileageRepository {
	return repository{db: db}
}

func (r repository) GetAccrualRequests(ctx context.Context, keyword string, customerID string, status string, submittedDate time.Time, page int, size int) ([]domain.AccrualRequest, int64, error) {
	qb := r.db.WithContext(ctx).Model(&domain.AccrualRequest{})

	if keyword != "" {
		qb = qb.Scopes(func(db *gorm.DB) *gorm.DB {
			var customerIDs []int64
			db.Session(&gorm.Session{NewDB: true}).Model(&domain.Customer{}).
				Where("email ILIKE ?", "%"+keyword+"%").
				Or("first_name || ' ' || last_name ILIKE ?", "%"+keyword+"%").
				Select("id").
				Find(&customerIDs)
			if len(customerIDs) > 0 {
				return db.Where("(ticket_id::TEXT = ? OR customer_id IN (?))", keyword, customerIDs)
			}

			return db.Where("ticket_id::TEXT = ?", keyword)
		})
	}

	if customerID != "" {
		qb = qb.Where("customer_id = ?", customerID)
	}
	if status != "" {
		qb = qb.Where("status = ?", status)
	}
	if !submittedDate.IsZero() {
		qb = qb.Where("created_at = ?", submittedDate)
	}

	var total int64
	if err := qb.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	qb = qb.Order("created_at DESC")

	offset, limit := pagination.ToSQLOffsetLimit(pagination.Pagination{Page: page, Size: size})
	if offset > 0 {
		qb = qb.Offset(offset)
	}
	if limit > 0 {
		qb = qb.Limit(limit)
	}

	qb = qb.Preload("Customer")

	var accrualRequests []domain.AccrualRequest
	if err := qb.Find(&accrualRequests).Error; err != nil {
		return nil, 0, err
	}
	return accrualRequests, total, nil
}

func (r repository) GetAccrualRequestByFilter(ctx context.Context, customerID string, ticketID string, pnr string) (domain.AccrualRequest, error) {
	qb := r.db.WithContext(ctx)
	if customerID != "" {
		qb = qb.Where("customer_id = ?", customerID)
	}
	if ticketID != "" {
		qb = qb.Where("ticket_id = ?", ticketID)
	}
	if pnr != "" {
		qb = qb.Where("pnr = ?", pnr)
	}

	var accrualRequest domain.AccrualRequest
	if err := qb.Find(&accrualRequest).Error; err != nil {
		return domain.AccrualRequest{}, err
	}

	return accrualRequest, nil
}

func (r repository) GetTravelDistance(ctx context.Context, fromCode string, toCode string) (domain.TravelDistance, error) {
	var travelDistance domain.TravelDistance
	if err := r.db.WithContext(ctx).
		Where("from_code = ? AND to_code = ?", fromCode, toCode).
		Or("from_code = ? AND to_code = ?", toCode, fromCode).
		First(&travelDistance).Error; err != nil {
		return domain.TravelDistance{}, err
	}
	return travelDistance, nil
}

func (r repository) SaveAccrualRequest(ctx context.Context, accrualRequest domain.AccrualRequest) error {
	if accrualRequest.ID == uuid.Nil {
		id, err := generator.AccrualRequestID.Generate()
		if err != nil {
			return err
		}
		accrualRequest.ID = id
	}
	return r.db.WithContext(ctx).Save(&accrualRequest).Error
}

func (r repository) GetAccrualRequest(ctx context.Context, id string) (domain.AccrualRequest, error) {
	var accrualRequest domain.AccrualRequest
	if err := r.db.WithContext(ctx).Where("id = ?", id).First(&accrualRequest).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return domain.AccrualRequest{}, nil
		}
		return domain.AccrualRequest{}, err
	}
	return accrualRequest, nil
}

func (r repository) IncreaseCustomerMiles(ctx context.Context, customerID string, qMiles float64, bMiles float64) error {
	if err := r.db.WithContext(ctx).Model(domain.Customer{}).
		Where("id = ?", customerID).
		Updates(map[string]interface{}{
			"qualifying_miles_total": gorm.Expr("qualifying_miles_total + ?", qMiles),
			"bonus_miles_total":      gorm.Expr("bonus_miles_total + ?", bMiles),
		}).Error; err != nil {
		return err
	}
	return nil
}

func (r repository) SaveMileageLedger(ctx context.Context, e domain.MilesLedger) error {
	if e.ID == uuid.Nil {
		id, err := generator.MilesLedgerID.Generate()
		if err != nil {
			return err
		}
		e.ID = id
	}
	return r.db.WithContext(ctx).Save(&e).Error
}

func (r repository) GetMileageLedgers(ctx context.Context, customerID string, date time.Time, page int, size int) ([]domain.MilesLedger, int64, error) {
	qb := r.db.WithContext(ctx).Model(&domain.MilesLedger{})

	if customerID != "" {
		qb = qb.Where("customer_id = ?", customerID)
	}

	if !date.IsZero() {
		qb = qb.Where("created_at = ?", date)
	}

	var total int64
	if err := qb.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset, limit := pagination.ToSQLOffsetLimit(pagination.Pagination{Page: page, Size: size})
	if offset > 0 {
		qb = qb.Offset(offset)
	}
	if limit > 0 {
		qb = qb.Limit(limit)
	}

	var accrualRequests []domain.MilesLedger
	if err := qb.Find(&accrualRequests).Error; err != nil {
		return nil, 0, err
	}
	return accrualRequests, total, nil
}

func (r repository) GetCustomersWithPositiveQMDeltasForMonth(ctx context.Context, monthToExpire time.Time) ([]int64, error) {
	var customerIDs []int64

	// Get first day of the month
	monthStart := time.Date(monthToExpire.Year(), monthToExpire.Month(), 1, 0, 0, 0, 0, monthToExpire.Location())
	monthEnd := monthStart.AddDate(0, 1, 0)

	err := r.db.WithContext(ctx).
		Model(&domain.MilesLedger{}).
		Where("earning_month >= ? AND earning_month < ? AND qualifying_miles_delta > 0", monthStart, monthEnd).
		Distinct("customer_id").
		Pluck("customer_id", &customerIDs).Error

	return customerIDs, err
}

func (r repository) GetTotalQMDeltasForCustomerAndMonth(ctx context.Context, customerID string, monthToExpire time.Time) (float64, error) {
	var total float64

	// Get first day of the month
	monthStart := time.Date(monthToExpire.Year(), monthToExpire.Month(), 1, 0, 0, 0, 0, monthToExpire.Location())
	monthEnd := monthStart.AddDate(0, 1, 0)

	err := r.db.WithContext(ctx).
		Model(&domain.MilesLedger{}).
		Where("customer_id = ? AND earning_month >= ? AND earning_month < ?", customerID, monthStart, monthEnd).
		Select("COALESCE(SUM(qualifying_miles_delta), 0)").
		Scan(&total).Error

	return total, err
}
