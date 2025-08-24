package generator

import (
	"github.com/viebiz/lit/snowflake"
)

var (
	CustomerID          *snowflake.Generator
	AccrualRequestID    *snowflake.Generator
	MilesLedgerID       *snowflake.Generator
	MembershipHistoryID *snowflake.Generator
	// Create ID generator for each entity
)

func Setup() error {
	var err error
	CustomerID, err = snowflake.New()
	if err != nil {
		return err
	}

	AccrualRequestID, err = snowflake.New()
	if err != nil {
		return err
	}

	MilesLedgerID, err = snowflake.New()
	if err != nil {
		return err
	}

	MembershipHistoryID, err = snowflake.New()
	if err != nil {
		return err
	}

	return nil
}
