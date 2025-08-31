package ports

import (
	"context"
	"time"

	"github.com/erwin-lovecraft/aegismiles/internal/entity"
)

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
