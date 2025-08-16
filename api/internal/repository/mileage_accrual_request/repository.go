package mileage_accrual_request

import (
	"context"
	"time"

	"github.com/erwin-lovecraft/aegismiles/internal/entity"
	"github.com/erwin-lovecraft/aegismiles/internal/pkg/generator"
	"gorm.io/gorm"
)

type Repository interface {
	GetByUserID(ctx context.Context, userID int64) ([]entity.MileageAccrualRequest, error)
	GetByID(ctx context.Context, id int64) (*entity.MileageAccrualRequest, error)
	Create(ctx context.Context, request entity.MileageAccrualRequest) error
	Update(ctx context.Context, id int64, request *entity.MileageAccrualRequest) error
	UpdateStatus(ctx context.Context, id int64, status string, rejectReason *string, reviewedAt *time.Time) error
	Delete(ctx context.Context, id int64) error
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

func (r *repository) GetByUserID(ctx context.Context, userID int64) ([]entity.MileageAccrualRequest, error) {
	var requests []entity.MileageAccrualRequest
	err := r.db.WithContext(ctx).
		Select("mileage_accrual_requests.*, to_jsonb(evidence_urls) AS evidence_urls").
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Find(&requests).Error
	return requests, err
}

func (r *repository) GetByID(ctx context.Context, id int64) (*entity.MileageAccrualRequest, error) {
	var request entity.MileageAccrualRequest
	err := r.db.WithContext(ctx).
		Where("id = ?", id).
		First(&request).Error
	if err != nil {
		return nil, err
	}
	return &request, nil
}

func (r *repository) Create(ctx context.Context, request entity.MileageAccrualRequest) error {

	if request.ID == 0 {
		id, err := generator.CustomerID.Generate()
		if err != nil {
			return err
		}
		request.ID = id
	}
	return r.db.WithContext(ctx).Create(request).Error
}

func (r *repository) Update(ctx context.Context, id int64, request *entity.MileageAccrualRequest) error {

	if err := r.db.WithContext(ctx).Where("id = ?", id).Save(request).Error; err != nil {
		return err
	}
	return nil
}

func (r *repository) UpdateStatus(ctx context.Context, id int64, status string, rejectReason *string, reviewedAt *time.Time) error {
	updates := map[string]interface{}{
		"status": status,
	}

	if rejectReason != nil {
		updates["reject_reason"] = rejectReason
	}

	if reviewedAt != nil {
		updates["reviewed_at"] = reviewedAt
	}

	return r.db.WithContext(ctx).
		Model(&entity.MileageAccrualRequest{}).
		Where("id = ?", id).
		Updates(updates).Error
}

func (r *repository) Delete(ctx context.Context, id int64) error {
	return r.db.WithContext(ctx).Delete(&entity.MileageAccrualRequest{}, id).Error
}
