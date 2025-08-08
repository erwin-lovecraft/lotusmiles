package entity

import (
	"time"
)

type Customer struct {
	ID        int64      `json:"id" gorm:"primaryKey"`
	CreatedAt time.Time  `json:"created_at" gorm:"created_at"`
	UpdatedAt time.Time  `json:"updated_at" gorm:"updated_at"`
	DeletedAt *time.Time `json:"deleted_at,omitempty" gorm:"deleted_at"`
	FirstName string     `json:"first_name" gorm:"first_name"`
	LastName  string     `json:"last_name" gorm:"last_name"`
	Email     string     `json:"email" gorm:"email"`
	Phone     string     `json:"phone" gorm:"phone"`
}
