package dto

import (
	"time"
)

type AccrualRequestInput struct {
	TicketID             string
	PNR                  string
	Carrier              string
	BookingClass         string
	FromCode             string
	ToCode               string
	DepartureDate        time.Time
	TicketImageURL       string
	BoardingPassImageURL string
}

type AccrualRequestFilter struct {
	Keyword       string
	Status        string
	SubmittedDate time.Time
	Page          int
	Size          int
}

type MileageLedgerFilter struct {
	Date time.Time
	Page int
	Size int
}
