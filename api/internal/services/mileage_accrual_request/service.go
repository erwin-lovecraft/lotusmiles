package mileage_accrual_request

import (
	"context"

	"github.com/erwin-lovecraft/aegismiles/internal/entity"
	"github.com/erwin-lovecraft/aegismiles/internal/repository"
)

type Service interface {
    GetByUserID(ctx context.Context, userID int64) ([]entity.MileageAccrualRequest, error)
    ListByExternalID(ctx context.Context, externalID string) ([]entity.MileageAccrualRequest, error)
	GetByID(ctx context.Context, id int64) (*entity.MileageAccrualRequest, error)
	Create(ctx context.Context, request *entity.MileageAccrualRequest) error
	Update(ctx context.Context, request *entity.MileageAccrualRequest) error
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

func (s *service) GetByID(ctx context.Context, id int64) (*entity.MileageAccrualRequest, error) {
	return s.repo.MileageAccrualRequest().GetByID(ctx, id)
}

func (s *service) Create(ctx context.Context, request *entity.MileageAccrualRequest) error {
	return s.repo.MileageAccrualRequest().Create(ctx, request)
}

func (s *service) Update(ctx context.Context, request *entity.MileageAccrualRequest) error {
	return s.repo.MileageAccrualRequest().Update(ctx, request)
}

func (s *service) Delete(ctx context.Context, id int64) error {
	return s.repo.MileageAccrualRequest().Delete(ctx, id)
}
