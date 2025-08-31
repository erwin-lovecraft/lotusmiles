package ports

import (
	"context"

	"github.com/erwin-lovecraft/lotusmiles/internal/core/dto"
)

type AuthGateway interface {
	GetUser(ctx context.Context, profileID string) (dto.Auth0UserProfile, error)
}

type SessionMGateway interface {
	GetUser(ctx context.Context, userID string) (dto.SessionMUserProfile, error)
	CreateUser(ctx context.Context, request dto.SessionMCreateUserRequest) (dto.SessionMUserProfile, error)
	DepositPoints(ctx context.Context, request dto.SessionMDepositPointsRequest) (dto.SessionMDepositPointsResponse, error)
}
