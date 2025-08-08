package dto

import (
	"github.com/erwin-lovecraft/aegismiles/internal/pkg/pagination"
)

type CustomerFilter struct {
	pagination.Pagination
	Name  string `json:"name"`
	Email string `json:"email"`
	Phone string `json:"phone"`
}
