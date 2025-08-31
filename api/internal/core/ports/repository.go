package ports

import (
	"context"
	"time"

	"github.com/erwin-lovecraft/lotusmiles/internal/core/domain"
)

type CustomerRepository interface {
	Save(ctx context.Context, customer domain.Customer) error
	GetByUserID(ctx context.Context, userID string) (domain.Customer, error)
	GetByID(ctx context.Context, customerID string) (domain.Customer, error)
}

type MileageRepository interface {
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

type MembershipRepository interface {
	GetCustomerQualifyingMiles(ctx context.Context, customerID string) (float64, error)
	UpdateCustomerMembershipTier(ctx context.Context, customerID string, memberTier string) error
	GetCustomerByID(ctx context.Context, customerID string) (domain.Customer, error)
	SaveMembershipHistory(ctx context.Context, history domain.MembershipHistory) error
	GetAllCustomerIDs(ctx context.Context, page, size int) ([]string, int64, error)
}

type Repository interface {
	Customer() CustomerRepository
	Mileage() MileageRepository
	Membership() MembershipRepository
}
