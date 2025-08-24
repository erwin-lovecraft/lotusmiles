package mileage

import (
	"context"
	"errors"
	"time"

	"github.com/erwin-lovecraft/aegismiles/internal/constants"
	"github.com/erwin-lovecraft/aegismiles/internal/entity"
	"github.com/erwin-lovecraft/aegismiles/internal/pkg/generator"
	"github.com/erwin-lovecraft/aegismiles/internal/pkg/pagination"
	"gorm.io/gorm"
)

type Repository interface {
	GetAccrualRequests(ctx context.Context, keyword string, customerID int64, status string, submittedDate time.Time, page int, size int) ([]entity.AccrualRequest, int64, error)

	GetAccrualRequestByFilter(ctx context.Context, customerID int64, ticketID string, pnr string) (entity.AccrualRequest, error)

	GetTravelDistance(ctx context.Context, fromCode string, toCode string) (entity.TravelDistance, error)

	SaveAccrualRequest(ctx context.Context, accrualRequest entity.AccrualRequest) error

	GetAccrualRequest(ctx context.Context, id int64) (entity.AccrualRequest, error)

	IncreaseCustomerMiles(ctx context.Context, customerID int64, qMiles float64, bMiles float64) error

	SaveMileageLedger(ctx context.Context, e entity.MilesLedger) error

	GetMileageLedgers(ctx context.Context, customerID int64, date time.Time, page int, size int) ([]entity.MilesLedger, int64, error)

	GetCustomersWithPositiveQMDeltasForMonth(ctx context.Context, monthToExpire time.Time) ([]int64, error)

	GetTotalQMDeltasForCustomerAndMonth(ctx context.Context, customerID int64, monthToExpire time.Time) (float64, error)

	CheckExpireRecordExists(ctx context.Context, customerID int64, monthToExpire time.Time) (bool, error)
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return repository{db: db}
}

func (r repository) GetAccrualRequests(ctx context.Context, keyword string, customerID int64, status string, submittedDate time.Time, page int, size int) ([]entity.AccrualRequest, int64, error) {
	qb := r.db.WithContext(ctx).Model(&entity.AccrualRequest{})

	if keyword != "" {
		qb = qb.Scopes(func(db *gorm.DB) *gorm.DB {
			var customerIDs []int64
			db.Session(&gorm.Session{NewDB: true}).Model(&entity.Customer{}).
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

	if customerID != 0 {
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

	var accrualRequests []entity.AccrualRequest
	if err := qb.Find(&accrualRequests).Error; err != nil {
		return nil, 0, err
	}
	return accrualRequests, total, nil
}

func (r repository) GetAccrualRequestByFilter(ctx context.Context, customerID int64, ticketID string, pnr string) (entity.AccrualRequest, error) {
	qb := r.db.WithContext(ctx)
	if customerID != 0 {
		qb = qb.Where("customer_id = ?", customerID)
	}
	if ticketID != "" {
		qb = qb.Where("ticket_id = ?", ticketID)
	}
	if pnr != "" {
		qb = qb.Where("pnr = ?", pnr)
	}

	var accrualRequest entity.AccrualRequest
	if err := qb.Find(&accrualRequest).Error; err != nil {
		return entity.AccrualRequest{}, err
	}

	return accrualRequest, nil
}

func (r repository) GetTravelDistance(ctx context.Context, fromCode string, toCode string) (entity.TravelDistance, error) {
	var travelDistance entity.TravelDistance
	if err := r.db.WithContext(ctx).
		Where("from_code = ? AND to_code = ?", fromCode, toCode).
		Or("from_code = ? AND to_code = ?", toCode, fromCode).
		First(&travelDistance).Error; err != nil {
		return entity.TravelDistance{}, err
	}
	return travelDistance, nil
}

func (r repository) SaveAccrualRequest(ctx context.Context, accrualRequest entity.AccrualRequest) error {
	if accrualRequest.ID == 0 {
		id, err := generator.AccrualRequestID.Generate()
		if err != nil {
			return err
		}
		accrualRequest.ID = id
	}
	return r.db.WithContext(ctx).Save(&accrualRequest).Error
}

func (r repository) GetAccrualRequest(ctx context.Context, id int64) (entity.AccrualRequest, error) {
	var accrualRequest entity.AccrualRequest
	if err := r.db.WithContext(ctx).Where("id = ?", id).First(&accrualRequest).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return entity.AccrualRequest{}, nil
		}
		return entity.AccrualRequest{}, err
	}
	return accrualRequest, nil
}

func (r repository) IncreaseCustomerMiles(ctx context.Context, customerID int64, qMiles float64, bMiles float64) error {
	if err := r.db.WithContext(ctx).Model(entity.Customer{ID: customerID}).Updates(map[string]interface{}{
		"qualifying_miles_total": gorm.Expr("qualifying_miles_total + ?", qMiles),
		"bonus_miles_total":      gorm.Expr("bonus_miles_total + ?", bMiles),
	}).Error; err != nil {
		return err
	}
	return nil
}

func (r repository) SaveMileageLedger(ctx context.Context, e entity.MilesLedger) error {
	if e.ID == 0 {
		id, err := generator.MilesLedgerID.Generate()
		if err != nil {
			return err
		}
		e.ID = id
	}
	return r.db.WithContext(ctx).Save(&e).Error
}

func (r repository) GetMileageLedgers(ctx context.Context, customerID int64, date time.Time, page int, size int) ([]entity.MilesLedger, int64, error) {
	qb := r.db.WithContext(ctx).Model(&entity.MilesLedger{})

	if customerID != 0 {
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

	var accrualRequests []entity.MilesLedger
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
		Model(&entity.MilesLedger{}).
		Where("earning_month >= ? AND earning_month < ? AND qualifying_miles_delta > 0", monthStart, monthEnd).
		Distinct("customer_id").
		Pluck("customer_id", &customerIDs).Error

	return customerIDs, err
}

func (r repository) GetTotalQMDeltasForCustomerAndMonth(ctx context.Context, customerID int64, monthToExpire time.Time) (float64, error) {
	var total float64

	// Get first day of the month
	monthStart := time.Date(monthToExpire.Year(), monthToExpire.Month(), 1, 0, 0, 0, 0, monthToExpire.Location())
	monthEnd := monthStart.AddDate(0, 1, 0)

	err := r.db.WithContext(ctx).
		Model(&entity.MilesLedger{}).
		Where("customer_id = ? AND earning_month >= ? AND earning_month < ?", customerID, monthStart, monthEnd).
		Select("COALESCE(SUM(qualifying_miles_delta), 0)").
		Scan(&total).Error

	return total, err
}

func (r repository) CheckExpireRecordExists(ctx context.Context, customerID int64, monthToExpire time.Time) (bool, error) {
	var count int64

	// Get first day of the month
	monthStart := time.Date(monthToExpire.Year(), monthToExpire.Month(), 1, 0, 0, 0, 0, monthToExpire.Location())
	monthEnd := monthStart.AddDate(0, 1, 0)

	err := r.db.WithContext(ctx).
		Model(&entity.MilesLedger{}).
		Where("customer_id = ? AND earning_month >= ? AND earning_month < ? AND kind = ?",
			customerID, monthStart, monthEnd, constants.LedgerKindExpire).
		Count(&count).Error

	return count > 0, err
}
