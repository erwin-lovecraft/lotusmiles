package ports

import (
	"context"
	"time"

	"github.com/erwin-lovecraft/aegismiles/internal/entity"
	"github.com/erwin-lovecraft/aegismiles/internal/models/dto"
)

type CustomerRepository interface {
	Save(ctx context.Context, customer entity.Customer) error
	GetByUserID(ctx context.Context, userID string) (entity.Customer, error)
	GetByID(ctx context.Context, customerID string) (entity.Customer, error)
}

type MileageRepository interface {
	GetAccrualRequests(ctx context.Context, keyword string, customerID string, status string, submittedDate time.Time, page int, size int) ([]entity.AccrualRequest, int64, error)
	GetAccrualRequestByFilter(ctx context.Context, customerID string, ticketID string, pnr string) (entity.AccrualRequest, error)
	GetTravelDistance(ctx context.Context, fromCode string, toCode string) (entity.TravelDistance, error)
	SaveAccrualRequest(ctx context.Context, accrualRequest entity.AccrualRequest) error
	GetAccrualRequest(ctx context.Context, id string) (entity.AccrualRequest, error)
	IncreaseCustomerMiles(ctx context.Context, customerID string, qMiles float64, bMiles float64) error
	SaveMileageLedger(ctx context.Context, e entity.MilesLedger) error
	GetMileageLedgers(ctx context.Context, customerID string, date time.Time, page int, size int) ([]entity.MilesLedger, int64, error)
	GetCustomersWithPositiveQMDeltasForMonth(ctx context.Context, monthToExpire time.Time) ([]int64, error)
	GetTotalQMDeltasForCustomerAndMonth(ctx context.Context, customerID string, monthToExpire time.Time) (float64, error)
}

type MembershipRepository interface {
	GetCustomerQualifyingMiles(ctx context.Context, customerID string) (float64, error)
	UpdateCustomerMembershipTier(ctx context.Context, customerID string, memberTier string) error
	GetCustomerByID(ctx context.Context, customerID string) (entity.Customer, error)
	SaveMembershipHistory(ctx context.Context, history entity.MembershipHistory) error
	GetAllCustomerIDs(ctx context.Context, page, size int) ([]string, int64, error)
}

type Repository interface {
	Customer() CustomerRepository
	Mileage() MileageRepository
	Membership() MembershipRepository
}

type AuthGateway interface {
	GetUser(ctx context.Context, profileID string) (dto.Auth0UserProfile, error)
}

type SessionMGateway interface {
	GetUser(ctx context.Context, userID string) (dto.SessionMUserProfile, error)
	CreateUser(ctx context.Context, request dto.SessionMCreateUserRequest) (dto.SessionMUserProfile, error)
	DepositPoints(ctx context.Context, request dto.SessionMDepositPointsRequest) (dto.SessionMDepositPointsResponse, error)
}
