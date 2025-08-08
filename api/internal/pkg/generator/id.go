package generator

import (
	"github.com/viebiz/lit/snowflake"
)

var (
	CustomerID *snowflake.Generator
	// Add other generators as needed
)

func Setup() error {
	var err error
	CustomerID, err = snowflake.New()
	if err != nil {
		return err
	}

	return nil
}
