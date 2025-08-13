package entity

import (
	"database/sql/driver"
	"fmt"
	"time"
)

type MileageAccrualRequest struct {
	ID                       int64           `json:"id" gorm:"primaryKey"`
	UserID                   int64           `json:"user_id" gorm:"not null"`
	Status                   string          `json:"status" gorm:"not null;default:'pending'"`
    	Metadata                 JSONValue       `json:"metadata" gorm:"type:jsonb;not null;default:'{}'"`
	EvidenceURLs             JSONValue       `json:"evidence_urls" gorm:"type:jsonb[];not null;default:'{}'"`
	DistanceMiles            int             `json:"distance_miles" gorm:"not null;default:0"`
	AccrualRate              float64         `json:"accrual_rate" gorm:"not null;default:0"`
	QualifyingMilesEarned    int             `json:"qualifying_miles_earned" gorm:"not null;default:0"`
	QualifyingSegmentsEarned int             `json:"qualifying_segments_earned" gorm:"not null;default:0"`
	BonusMilesEarned         int             `json:"bonus_miles_earned" gorm:"not null;default:0"`
	ReviewerID               int64           `json:"reviewer_id" gorm:"not null"`
	ReviewedAt               *time.Time      `json:"reviewed_at"`
	RejectReason             *string         `json:"reject_reason"`
	CreatedAt                time.Time       `json:"created_at" gorm:"default:CURRENT_TIMESTAMP"`
	UpdatedAt                time.Time       `json:"updated_at" gorm:"default:CURRENT_TIMESTAMP"`

	// Relations
	User     *User `json:"user,omitempty" gorm:"foreignKey:UserID"`
	Reviewer *User `json:"reviewer,omitempty" gorm:"foreignKey:ReviewerID"`
}

// TableName specifies the table name for GORM
func (MileageAccrualRequest) TableName() string {
	return "mileage_accrual_requests"
}

// JSONValue is a minimal JSON holder that works with various drivers (string or []byte)
type JSONValue []byte

// Scan implements the sql.Scanner interface.
func (j *JSONValue) Scan(value any) error {
    switch v := value.(type) {
    case nil:
        *j = nil
        return nil
    case []byte:
        *j = append((*j)[:0], v...)
        return nil
    case string:
        *j = append((*j)[:0], v...)
        return nil
    default:
        return fmt.Errorf("unsupported JSON scan type: %T", value)
    }
}

// Value implements the driver.Valuer interface.
func (j JSONValue) Value() (driver.Value, error) {
    if j == nil {
        return nil, nil
    }
    return []byte(j), nil
}
