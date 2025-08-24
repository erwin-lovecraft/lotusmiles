package cron

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/erwin-lovecraft/aegismiles/internal/config"
	"github.com/erwin-lovecraft/aegismiles/internal/repository"
	"github.com/erwin-lovecraft/aegismiles/internal/services/membership"
	"github.com/erwin-lovecraft/aegismiles/internal/services/mileage"
	"github.com/robfig/cron/v3"
)

type Scheduler struct {
	config        config.Config
	cron          *cron.Cron
	repo          repository.Repository
	mileageSvc    mileage.Service
	membershipSvc membership.Service
}

func NewScheduler(repo repository.Repository, mileageSvc mileage.Service, membershipSvc membership.Service, cfg config.Config) (*Scheduler, error) {
	c := cron.New(cron.WithLocation(time.UTC))

	return &Scheduler{
		cron:          c,
		repo:          repo,
		mileageSvc:    mileageSvc,
		membershipSvc: membershipSvc,
		config:        cfg,
	}, nil
}

// Start initializes and starts the cron jobs
func (s *Scheduler) Start() error {
	log.Printf("Starting cron scheduler UTC")
	log.Printf("Expire QM cron: %s", s.config.Cron.ExpireQMCron)
	log.Printf("Recalc tier cron: %s", s.config.Cron.RecalcTierCron)

	// Log current configuration
	log.Printf("Expire period: %v", s.config.Loyalty.ExpirePeriodMinutes)
	log.Printf("Rolling window period: %v", s.config.Loyalty.RollingWindowPeriodMinutes)
	log.Printf("Batch size: %d", s.config.Loyalty.BatchSize)

	// Schedule expire qualifying miles job
	_, err := s.cron.AddFunc(s.config.Cron.ExpireQMCron, s.expireQualifyingMilesJob)
	if err != nil {
		return fmt.Errorf("failed to schedule expire QM job: %w", err)
	}

	// Schedule recalculate tiers job
	_, err = s.cron.AddFunc(s.config.Cron.RecalcTierCron, s.recalculateTiersJob)
	if err != nil {
		return fmt.Errorf("failed to schedule recalc tier job: %w", err)
	}

	s.cron.Start()
	log.Println("Cron scheduler started successfully")
	return nil
}

// Stop gracefully stops the cron scheduler
func (s *Scheduler) Stop() {
	log.Println("Stopping cron scheduler...")
	ctx := s.cron.Stop()
	<-ctx.Done()
	log.Println("Cron scheduler stopped")
}

// expireQualifyingMilesJob expires qualifying miles for the month that is configured period old
func (s *Scheduler) expireQualifyingMilesJob() {
	startTime := time.Now()
	log.Printf("Starting expire qualifying miles job at %s", startTime.Format(time.RFC3339))

	// Calculate month to expire based on configured expire period
	expirePeriod := time.Duration(s.config.Loyalty.ExpirePeriodMinutes) * time.Minute
	monthToExpire := time.Now().Add(-expirePeriod)

	log.Printf("Expiring miles from %s (period: %v)", monthToExpire.Format("2006-01"), expirePeriod)

	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(s.config.Loyalty.JobTimeoutMinutes)*time.Minute)
	defer cancel()

	if err := s.mileageSvc.ExpireQualifyingMilesForMonth(ctx, monthToExpire); err != nil {
		log.Printf("Error in expire qualifying miles job: %v", err)
		return
	}

	duration := time.Since(startTime)
	log.Printf("Completed expire qualifying miles job in %v", duration)
}

// recalculateTiersJob recalculates membership tiers for all customers
func (s *Scheduler) recalculateTiersJob() {
	startTime := time.Now()
	log.Printf("Starting recalculate tiers job at %s", startTime.Format(time.RFC3339))

	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(s.config.Loyalty.RecalcJobTimeoutMinutes)*time.Minute)
	defer cancel()

	if err := s.membershipSvc.RecalculateAllTiers(ctx); err != nil {
		log.Printf("Error in recalculate tiers job: %v", err)
		return
	}

	duration := time.Since(startTime)
	log.Printf("Completed recalculate tiers job in %v", duration)
}
