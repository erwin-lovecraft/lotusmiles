package mileage_accrual_request

import (
	"context"
	"fmt"
	"time"

	"github.com/erwin-lovecraft/aegismiles/internal/entity"
	"github.com/erwin-lovecraft/aegismiles/internal/models/dto"
	"github.com/erwin-lovecraft/aegismiles/internal/repository"
	"github.com/viebiz/lit/iam"
)

type Service interface {
	GetByUserID(ctx context.Context, userID int64) ([]entity.MileageAccrualRequest, error)
	ListByExternalID(ctx context.Context, externalID string) ([]entity.MileageAccrualRequest, error)
	// CreateByExternalID(ctx context.Context, externalID string, metadata entity.JSONValue) (entity.MileageAccrualRequest, error)
	GetByID(ctx context.Context, id int64) (*entity.MileageAccrualRequest, error)
	Create(ctx context.Context, request entity.MileageAccrualRequest) error
	Update(ctx context.Context, request *entity.MileageAccrualRequest) error
	UpdateStatus(ctx context.Context, id int64, status dto.UpdateMileageStatus) error
	Delete(ctx context.Context, id int64) error
}

type service struct {
	repo repository.Repository
}

func New(repo repository.Repository) Service {
	return &service{repo: repo}
}

func (s *service) GetByUserID(ctx context.Context, userID int64) ([]entity.MileageAccrualRequest, error) {
	return s.repo.MileageAccrualRequest().GetByUserID(ctx, userID)
}

func (s *service) ListByExternalID(ctx context.Context, externalID string) ([]entity.MileageAccrualRequest, error) {
	user, err := s.repo.User().FindByExternalID(ctx, externalID)
	if err != nil {
		return nil, err
	}
	if user.ID == 0 {
		return []entity.MileageAccrualRequest{}, nil
	}
	requests, err := s.repo.MileageAccrualRequest().GetByUserID(ctx, user.ID)
	return requests, err
}

// func (s *service) CreateByExternalID(ctx context.Context, externalID string, metadata entity.JSONValue) (entity.MileageAccrualRequest, error) {
// 	u, err := s.repo.User().FindByExternalID(ctx, externalID)
// 	if err != nil {
// 		return entity.MileageAccrualRequest{}, err
// 	}
// 	if u.ID == 0 {
// 		return entity.MileageAccrualRequest{}, nil
// 	}
// 	req := entity.MileageAccrualRequest{
// 		UserID:     u.ID,
// 		Status:     "pending",
// 		Metadata:   metadata,
// 		ReviewerID: u.ID,
// 	}
// 	if err := s.repo.MileageAccrualRequest().Create(ctx, &req); err != nil {
// 		return entity.MileageAccrualRequest{}, err
// 	}
// 	return req, nil
// }

func (s *service) GetByID(ctx context.Context, id int64) (*entity.MileageAccrualRequest, error) {
	return s.repo.MileageAccrualRequest().GetByID(ctx, id)
}

func (s *service) Create(ctx context.Context, request entity.MileageAccrualRequest) error {

	userProfile := iam.GetUserProfileFromContext(ctx).GetProfile()

	userId := getStringValue(userProfile["user_id"])
	customer, err := s.repo.Customer().FindByExternalID(ctx, userId)
	if err != nil {
		return err
	}

	request.UserID = customer.ID
	request.ReviewerID = customer.ID
	return s.repo.MileageAccrualRequest().Create(ctx, request)
}

func (s *service) Update(ctx context.Context, request *entity.MileageAccrualRequest) error {

	return s.repo.MileageAccrualRequest().Update(ctx, 244637051507500253, request)
}

func (s *service) UpdateStatus(ctx context.Context, id int64, status dto.UpdateMileageStatus) error {
	var reviewedAt *time.Time

	// Nếu status là approved hoặc rejected, cập nhật ReviewedAt
	if status.Status == "approved" || status.Status == "rejected" {
		now := time.Now()
		reviewedAt = &now
	}

	// Sử dụng repository method mới để update status
	return s.repo.MileageAccrualRequest().UpdateStatus(ctx, id, status.Status, status.RejectReason, reviewedAt)
}

func (s *service) Delete(ctx context.Context, id int64) error {
	return s.repo.MileageAccrualRequest().Delete(ctx, id)
}
func getStringValue(v interface{}) string {
	if v == nil {
		return ""
	}
	return fmt.Sprintf("%v", v)
}
