package entity

import (
	"time"
)

type MileageAccrualRequest struct {
	ID                       int64      `json:"id" gorm:"column:id;primaryKey;autoIncrement:false"`
	UserID                   int64      `json:"user_id" gorm:"column:user_id;not null"`
	Status                   string     `json:"status" gorm:"column:status;type:text;not null;default:'pending'"` // pending, approved, rejected, cancelled
	Carrier                  string     `json:"carrier" gorm:"column:carrier;type:text;not null"`
	BookingClass             string     `json:"booking_class" gorm:"column:booking_class;type:text;not null"`
	From                     string     `json:"from" gorm:"column:from;type:text;not null"`
	To                       string     `json:"to" gorm:"column:to;type:text;not null"`
	DepartureDate            string     `json:"departure_date" gorm:"column:departure_date;type:text;not null"`
	Tier                     string     `json:"tier" gorm:"column:tier;type:text;not null"`
	DistanceMiles            int        `json:"distance_miles" gorm:"column:distance_miles;not null;default:0"`
	AccrualRate              float64    `json:"accrual_rate" gorm:"column:accrual_rate;not null;default:0"`
	QualifyingMilesEarned    int        `json:"qualifying_miles_earned" gorm:"column:qualifying_miles_earned;not null;default:0"`
	QualifyingSegmentsEarned int        `json:"qualifying_segments_earned" gorm:"column:qualifying_segments_earned;not null;default:0"`
	BonusMilesEarned         int        `json:"bonus_miles_earned" gorm:"column:bonus_miles_earned;not null;default:0"`
	ReviewerID               int64      `json:"reviewer_id" gorm:"column:reviewer_id;not null"`
	ReviewedAt               *time.Time `json:"reviewed_at,omitempty" gorm:"column:reviewed_at;type:timestamptz"`
	RejectReason             *string    `json:"reject_reason,omitempty" gorm:"column:reject_reason;type:text"`
	CreatedAt                time.Time  `json:"created_at" gorm:"column:created_at;type:timestamptz;autoCreateTime"`
	UpdatedAt                time.Time  `json:"updated_at" gorm:"column:updated_at;type:timestamptz;autoUpdateTime"`
}

// TableName specifies the table name for GORM
func (MileageAccrualRequest) TableName() string {
	return "mileage_accrual_requests"
}

// JSONValue is a minimal JSON holder that works with various drivers (string or []byte)
type JSONValue map[string]interface{}

// Scan implements the sql.Scanner interface.
// func (j *JSONValue) Scan(value any) error {
// 	switch v := value.(type) {
// 	case nil:
// 		*j = nil
// 		return nil
// 	case []byte:
// 		*j = append((*j)[:0], v...)
// 		return nil
// 	case string:
// 		*j = append((*j)[:0], v...)
// 		return nil
// 	default:
// 		return fmt.Errorf("unsupported JSON scan type: %T", value)
// 	}
// }

// // Value implements the driver.Valuer interface.
// func (j JSONValue) Value() (driver.Value, error) {
// 	if j == nil {
// 		return nil, nil
// 	}
// 	return []byte(j), nil
// }
