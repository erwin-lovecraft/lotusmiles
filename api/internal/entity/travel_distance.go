package entity

import (
	"time"
)

type TravelDistance struct {
	ID        int64     `json:"id" gorm:"primaryKey"`
	FromCode  string    `json:"from_code"`
	ToCode    string    `json:"to_code"`
	Miles     int       `json:"miles"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// TableName specifies the table name for GORM
func (TravelDistance) TableName() string {
	return "travel_distances"
}
