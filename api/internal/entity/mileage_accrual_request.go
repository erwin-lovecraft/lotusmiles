package entity

import (
	"time"
)

type AccrualRequest struct {
	ID                    int64      `json:"id,string" gorm:"primaryKey"`
	CustomerID            int64      `json:"customer_id,string"`
	Status                string     `json:"status"`
	TicketID              string     `json:"ticket_id"`
	PNR                   string     `json:"pnr"`
	Carrier               string     `json:"carrier"`
	BookingClass          string     `json:"booking_class"`
	FromCode              string     `json:"from_code"`
	ToCode                string     `json:"to_code"`
	DepartureDate         time.Time  `json:"departure_date"`
	TicketImageURL        string     `json:"ticket_image_url"`
	BoardingPassImageURL  string     `json:"boarding_pass_image_url"`
	DistanceMiles         int        `json:"distance_miles"`
	QualifyingAccrualRate float64    `json:"qualifying_accrual_rate"`
	QualifyingMiles       float64    `json:"qualifying_miles"`
	BonusAccrualRate      float64    `json:"bonus_accrual_rate"`
	BonusMiles            float64    `json:"bonus_miles"`
	ReviewerID            *string    `json:"reviewer_id"`
	ReviewedAt            *time.Time `json:"reviewed_at"`
	RejectedReason        *string    `json:"rejected_reason"`
	CreatedAt             time.Time  `json:"created_at"`
	UpdatedAt             time.Time  `json:"updated_at"`
	Customer              *Customer  `json:"customer,omitempty"`
}

// TableName specifies the table name for GORM
func (AccrualRequest) TableName() string {
	return "accrual_requests"
}
