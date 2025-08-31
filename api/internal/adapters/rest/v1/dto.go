package v1

import (
	"time"

	"github.com/erwin-lovecraft/lotusmiles/internal/core/dto"
)

type AccrualRequestInput struct {
	TicketID             string    `json:"ticket_id" binding:"required,min=1"`
	PNR                  string    `json:"pnr" binding:"required,min=1"`
	Carrier              string    `json:"carrier" binding:"required,min=1"`
	BookingClass         string    `json:"booking_class" binding:"required,min=1,max=1"`
	FromCode             string    `json:"from_code" binding:"required,min=3,max=3"`
	ToCode               string    `json:"to_code" binding:"required,min=3,max=3"`
	DepartureDate        time.Time `json:"departure_date" binding:"required"`
	TicketImageURL       string    `json:"ticket_image_url" binding:"omitempty,url"`
	BoardingPassImageURL string    `json:"boarding_pass_image_url" binding:"omitempty,url"`
}

func (input AccrualRequestInput) toApplicationDTO() dto.AccrualRequestInput {
	return dto.AccrualRequestInput{
		TicketID:             input.TicketID,
		PNR:                  input.PNR,
		Carrier:              input.Carrier,
		BookingClass:         input.BookingClass,
		FromCode:             input.FromCode,
		ToCode:               input.ToCode,
		DepartureDate:        input.DepartureDate,
		TicketImageURL:       input.TicketImageURL,
		BoardingPassImageURL: input.BoardingPassImageURL,
	}
}

type ApproveRequestInput struct {
	ID string `uri:"id" binding:"required"`
}

type RejectedRequestInput struct {
	ID             string `uri:"id" binding:"required"`
	RejectedReason string `json:"rejected_reason" binding:"required,min=1"`
}

type AccrualRequestFilter struct {
	Keyword       string    `form:"keyword" json:"keyword"`
	Status        string    `form:"status" json:"status"`
	SubmittedDate time.Time `form:"submitted_date" json:"submitted_date"`
	Page          int       `form:"page" json:"page"`
	Size          int       `form:"size" json:"size"`
}

func (input AccrualRequestFilter) toApplicationDTO() dto.AccrualRequestFilter {
	return dto.AccrualRequestFilter{
		Keyword:       input.Keyword,
		Status:        input.Status,
		SubmittedDate: input.SubmittedDate,
		Page:          input.Page,
		Size:          input.Size,
	}
}

type MileageLedgerFilter struct {
	Date time.Time `form:"date" json:"date"`
	Page int       `form:"page" json:"page"`
	Size int       `form:"size" json:"size"`
}

func (input MileageLedgerFilter) toApplicationDTO() dto.MileageLedgerFilter {
	return dto.MileageLedgerFilter{
		Date: input.Date,
		Page: input.Page,
		Size: input.Size,
	}
}
