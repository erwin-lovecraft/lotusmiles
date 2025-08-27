package generator

import (
	"github.com/google/uuid"
)

var (
	CustomerID          UUIDGenerator
	AccrualRequestID    UUIDGenerator
	MilesLedgerID       UUIDGenerator
	MembershipHistoryID UUIDGenerator
	// Create ID generator for each entity
)

func Setup() error {
	return nil
}

type UUIDGenerator struct{}

func (u UUIDGenerator) Generate() (uuid.UUID, error) {
	return uuid.NewRandom()
}
