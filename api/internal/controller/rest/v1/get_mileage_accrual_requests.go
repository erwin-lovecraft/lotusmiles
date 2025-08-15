package v1

import (
	"fmt"
	"net/http"

	"github.com/viebiz/lit"
	"github.com/viebiz/lit/iam"
)

type GetMileageAccrualRequestsResponse struct {
	Data []MileageAccrualRequestResponse `json:"data"`
}

type MileageAccrualRequestResponse struct {
	ID                       int64       `json:"id"`
	UserID                   int64       `json:"user_id"`
	Status                   string      `json:"status"`
	Metadata                 interface{} `json:"metadata"`
	EvidenceURLs             interface{} `json:"evidence_urls"`
	DistanceMiles            int         `json:"distance_miles"`
	AccrualRate              float64     `json:"accrual_rate"`
	QualifyingMilesEarned    int         `json:"qualifying_miles_earned"`
	QualifyingSegmentsEarned int         `json:"qualifying_segments_earned"`
	BonusMilesEarned         int         `json:"bonus_miles_earned"`
	ReviewerID               int64       `json:"reviewer_id"`
	ReviewedAt               *string     `json:"reviewed_at"`
	RejectReason             *string     `json:"reject_reason"`
	CreatedAt                string      `json:"created_at"`
	UpdatedAt                string      `json:"updated_at"`
}

func (c Controller) GetMileageAccrualRequests(ctx lit.Context) error {
	// Get user profile from context
	userProfile := iam.GetUserProfileFromContext(ctx.Request().Context())
	// Convert user ID from string to int64
	// userID, err := strconv.ParseInt(userProfile.ID(), 10, 64)
	// fmt.Println("userID", userProfile.ID())

	// if err != nil {
	// 	return lit.HTTPError{
	// 		Status: http.StatusBadRequest,
	// 		Code:   "invalid_user_id",
	// 		Desc:   "Invalid user ID format",
	// 	}
	// }

	// Get mileage accrual requests for the user via external id lookup
	requests, err := c.mileageAccrualRequestService.ListByExternalID(ctx.Request().Context(), userProfile.ID())
	if err != nil {
		fmt.Printf("GetMileageAccrualRequests error: %v\n", err)
		return lit.HTTPError{
			Status: http.StatusInternalServerError,
			Code:   "internal_error",
			Desc:   "Failed to fetch mileage accrual requests",
		}
	}

	// Convert to response format
	response := GetMileageAccrualRequestsResponse{
		Data: make([]MileageAccrualRequestResponse, len(requests)),
	}
	fmt.Println("response", response)
	for i, req := range requests {
		response.Data[i] = MileageAccrualRequestResponse{
			UserID:                   req.UserID,
			Status:                   req.Status,
			DistanceMiles:            req.DistanceMiles,
			AccrualRate:              req.AccrualRate,
			QualifyingMilesEarned:    req.QualifyingMilesEarned,
			QualifyingSegmentsEarned: req.QualifyingSegmentsEarned,
			BonusMilesEarned:         req.BonusMilesEarned,
			ReviewerID:               req.ReviewerID,
			RejectReason:             req.RejectReason,
		}

	}

	return ctx.JSON(http.StatusOK, response)
}
