package pagination

import (
	"github.com/viebiz/lit"
)

const (
	paginationMaxSizePerPage int = 100
)

type Pagination struct {
	Page          int  `form:"page,default=1"`
	Size          int  `form:"size,default=30"`
	IncludeTotals bool `form:"include_totals,default=true"`
}

func (p Pagination) Valid() error {
	if p.Size > paginationMaxSizePerPage {
		return lit.HTTPError{Status: 400, Code: "pagination.size_exceeds_max", Desc: "Size exceeds maximum allowed per page"}
	}
	if p.Size <= 0 {
		return lit.HTTPError{Status: 400, Code: "pagination.size_must_be_greater_than_zero", Desc: "Size must be greater than zero"}
	}

	if p.Page <= 0 {
		return lit.HTTPError{Status: 400, Code: "pagination.page_must_be_greater_than_zero", Desc: "Page must be greater than zero"}
	}

	return nil
}

func ToSQLOffsetLimit(in Pagination) (int, int) {
	limit := in.Size
	offset := limit * (in.Page - 1)

	return offset, limit
}
