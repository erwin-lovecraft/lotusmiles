package main

import (
	"context"
	"log"
	"os"
)

func main() {
	ctx := context.Background()
	if err := run(ctx); err != nil {
		log.Printf("service exited abnormally: %+v", err)
		os.Exit(1)
	}
}

func run(ctx context.Context) error {
	return nil
}
